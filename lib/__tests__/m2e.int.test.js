const express = require('express');
const { Schema, model, connect } = require('mongoose');
const supertest = require('supertest');
const bodyParser = require('body-parser');
const plugin = require('..');
const Builder = require('../middlewareBuilder');
const helper = require('../middlewareHelper');

const app = express();
const req = supertest(app);
let run = 0;

const DemoChildSchema = new Schema({
  year: {
    type: Date,
    required: true,
    min: new Date(),
  },
});

const DemoDiscriminatedChildSchema = new Schema({
  month: {
    type: String,
    enum: ['January', 'February'],
  },
});

const DemoSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 21,
    max: 29,
  },
  birth: {
    type: Date,
  },
  position: {
    type: String,
    enum: ['Boss', 'Employee'],
  },
  streetLine1: {
    type: String,
    minLength: 2,
    maxLength: 10,
  },
  check: Boolean,
  years: [DemoChildSchema],
});

app.use(bodyParser.json());
DemoSchema.plugin(plugin);

const Model = model('TEST', DemoSchema);

Model.discriminator(
  'TEST_DISCRIMINATOR',
  new Schema({
    referenceID: Schema.Types.ObjectId,
    friends: [String],
    numberOfColleagues: {
      type: Number,
      required: true,
    },
    systemGenerated: {
      type: String,
      systemOnly: true,
      required: true,
    },
    months: [DemoDiscriminatedChildSchema],
  }),
);

const testErrorKeys = ({ body, status }, keys = []) => {
  const matches =
    typeof body === 'object' &&
    'errors' in body &&
    keys.length === Object.keys(body.errors).length &&
    keys.every((name) =>
      Object.keys(body.errors).includes(name),
    );

  if (!keys || !keys.length) {
    expect(status).toBe(200);
  } else {
    expect(matches).toBeTruthy();
    expect(status).toBe(422);
  }
};

// eslint-disable-next-line
const controller = (req, res) =>
  res.status(200).send();

// eslint-disable-next-line
const handler = (err, req, res, next) =>
  res.status(422).json(err);

const testSetup = async (method, request, errors) => {
  run += 1; // keeps the URL unique per test (yeah, I know...)

  const inst = new Builder(method);
  const uri = `/${run}`;
  app.post(
    uri,
    await inst.exec.bind(inst),
    helper,
    controller,
    handler,
  );

  testErrorKeys(await req.post(uri).send(request), errors);
};

describe('Integration testing', () => {
  beforeAll(async () => {
    await connect(process.env.CONNECTION);
  });

  describe('Base schema', () => {
    it('should fail with bad types and missing required props', async () => {
      await testSetup(
        Model.getSchemaPaths(),
        {
          age: 32,
          position: 'Receptionist',
          birth: '2019-29',
          streetLine1: 'H',
          check: 'ANYTHING CONVERTS',
        },
        ['firstName', 'position', 'birth', 'streetLine1'],
      );
    });

    it('should pass with required props and valid types', async () => {
      await testSetup(Model.getSchemaPaths(), {
        firstName: 'Mike',
        age: 24,
        position: 'Boss',
        birth: '2019-12-04',
        check: false,
      });
    });

    it('should allow for nullable but not empty required fields', async () => {
      const validation = Model.getSchemaPaths(false);
      await testSetup(validation);
      await testSetup(validation, { firstName: '' }, [
        'firstName',
      ]);
    });
  });

  describe('Discriminated schema', () => {
    it('should test ObjectId and simple arrays', async () => {
      await testSetup(
        Model.getSchemaPaths(false),
        {
          __t: 'TEST_DISCRIMINATOR',
          referenceID: '123',
          friends: 'Name',
        },
        ['referenceID', 'friends'],
      );
    });

    it('should switch validation models', async () => {
      await testSetup(Model.getSchemaPaths(), {
        __t: 'TEST_DISCRIMINATOR',
        firstName: 'John',
        numberOfColleagues: 3,
        friends: ['Name'],
      });
    });

    it('should preserve nullability of required fields', async () => {
      await testSetup(Model.getSchemaPaths(false), {
        __t: 'TEST_DISCRIMINATOR',
      });
    });
  });

  describe('Child schema', () => {
    it('should only run nested schema validation', async () => {
      await testSetup(Model.getChildPaths('years'), {
        year: 2019,
      });
    });

    it('should default to discriminated request if no variant exists', async () => {
      await testSetup(Model.getChildPaths('months'), {
        month: 'February',
      });
    });
  });
});
