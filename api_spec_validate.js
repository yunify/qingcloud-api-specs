var fs   = require('fs');
var path = require('path');
var glob = require('glob');

var _         = require('lodash');
var ZSchema   = require('z-schema');
var JSONRefs = require('json-refs');

var validator = new ZSchema();

const swagger2Paths  = glob.sync(`${__dirname}/**/swagger/api_v2.0.json`);
const swagger2Schema = fs.readFileSync(`${__dirname}/api_spec_schema_swagger_v2.0.json`);

describe('API Spec (Swagger v2.0)', () => {
  _.each(swagger2Paths, spec => {
    it(`${spec} should be valid.`, done => {
      JSONRefs.resolveRefs(JSON.parse(fs.readFileSync(spec)), {
        filter: ['relative'],
        relativeBase: path.dirname(spec),
      }).then(
        result => {
          const isValid = validator.validate(result.resolved, JSON.parse(swagger2Schema));
          if (!isValid) {
            done(`\n${JSON.stringify(validator.getLastErrors(), null, 2)}`);
          } else {
            done();
          }
        },
        error => {
          done(error);
        }
      );
    });
  });
});
