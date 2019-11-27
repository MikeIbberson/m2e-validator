const { validationResult } = require('express-validator');
const express = require('express');
const { Schema, model, connect } = require('mongoose');
const supertest = require('supertest');
const bodyParser = require('body-parser');
const plugin = require('..');
const Builder = require('../middlewareBuilder');

let Model;
const app = express();
const req = supertest(app);

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
});

const validateBody = (r, res) => {
  try {
    validationResult(r).throw();
    res.status(200).send();
  } catch (e) {
    res.status(422).json(e.mapped());
  }
};

beforeAll(async () => {
  DemoSchema.plugin(plugin);
  Model = model('TEST', DemoSchema);
  await connect(process.env.CONNECTION);
  app.use(bodyParser.json());
});

describe('Integration testing', () => {
  it('should export a schema', async () => {
    const inst = new Builder(Model.getSchemaPaths());
    app.post('/', await inst.exec.bind(inst), validateBody);

    await req
      .post('/')
      .send({})
      .expect(422);
  });
});
