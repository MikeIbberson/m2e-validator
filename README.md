<h1>🔌 Mongoose to Express-Validator adapter</h1>
<p>
  <img src="https://github.com/MikeIbberson/m2e-validator/workflows/Node%20CI/badge.svg" alt="Status" />
<a href='https://coveralls.io/github/MikeIbberson/m2e-validator?branch=master'><img src='https://coveralls.io/repos/github/MikeIbberson/m2e-validator/badge.svg?branch=master' alt='Coverage Status' /></a>
<a href="https://www.codacy.com/manual/MikeIbberson/m2e-validator?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=MikeIbberson/m2e-validator&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/3f4a7575589c49cc9e1c6b51577ad3ea"/></a>
<img src='https://bettercodehub.com/edge/badge/MikeIbberson/m2e-validator?branch=master'>
</p>
<p>This package converts <a href="https://mongoosejs.com/docs/schematypes.html">Mongoose</a> schema into a validation chain for <a href="https://express-validator.github.io/docs/schema-validation.html">Express</a>. Currently, it supports most default schema types as well as a few custom ones. For instance, schema types named Email or Phone match validator's implementation. See the full list of supported properties below.</p>
<h2>The plugin</h2>
<p>This module works through a custom Mongoose plugin that appends two static methods,  <code>getSchemaPaths</code> and <code>getChildPaths</code>. Both work recursively and support child and discriminator schemas. To access a discriminator, though, the request object must contain a reference to its key. See the examples below for more detail.</p>

``` Javascript
// coming soon
```

<h2>The schemas</h2>
<p>All schema types support required and systemOnly properties. The latter omits the field from validation altogether.</p>

| Name        | Options                    | Notes                                     |
| ----------- | -------------------------- | ----------------------------------------- |
| String      | minLength, maxLength, enum | Auto escapes and trims                    |
| Number      | min, max                   |                                           |
| ObjectId    |                            |                                           |
| SchemaArray |                            |                                           |
| Date        |                            | Auto converts to ISO string               |
| Boolean     |                            | Auto converts any non-falsy value to true |
| URL         | --                         | Auto normalizes                           |
| Email       | --                         | Auto normalizes                           |
| Phone       | --                         |                                           |
