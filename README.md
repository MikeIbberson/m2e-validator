<h1>🔌 Mongoose to Express-Validator adapter</h1>

<p>This package converts <a href="https://mongoosejs.com/docs/schematypes.html">Mongoose</a> schema into a validation chain for <a href="https://express-validator.github.io/docs/schema-validation.html">Express</a>. Currently, it supports most default schema types as well as a few custom ones. For instance, schema types named Email or Phone match validator's implementation. See the full list of supported properties below.</p>
<h2>The plugin</h2>
This module works through a custom Mongoose plugin that appends two static methods,  <code>getSchemaPaths</code> and <code>getChildPaths</code>. Both work recursively and support child and discriminator schemas. To access a discriminator, though, the request object must contain a reference to its key. See the examples below for more detail.

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