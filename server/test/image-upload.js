const request = require('supertest');
const expect = require('expect');
const _ = require('lodash');
const path = require('path');

const s3Service = require('../services/s3/index');
const { app } = require('../index');
const User = require('../model/user');
const tokenSrvc = require('../services/token/token');

/**
 * Limpia todas las imagenes almacenadas en el s3 bucket
 * @param {*} params
 */
function cleanAll() {
  before(done => {
    s3Service
      .imageDelete()
      .then(() => {
        done();
      })
      .catch(e => done(e));
  });
}

describe('IMAGE-UPLOAD TEST: /api/v1/image-upload', function() {
  cleanAll();

  it('should update correctly an image', done => {
    this.timeout(5000);

    const imagePath = path.join(__dirname, '..', '/assets/test/Image.jpg');

    User.findOne({})
      .then(user => {
        const token = tokenSrvc.makeToken(user);

        request(app)
          .post('/api/v1/image-upload')
          .set('Authorization', `Bearer ${token}`)
          .attach('image', imagePath)
          .expect(200)
          .expect((res, err) => {
            if (err) done(err);
            expect(res.body.user).toBeTruthy();
            expect(_.isString(res.body.user.image)).toBeTruthy();
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      })
      .catch(e => done(e));
  });

  it('should reject with not authorized error', done => {
    request(app)
      .post('/api/v1/image-upload')
      .set('Authorization', 'Bearer ')
      .expect(401)
      .expect(res => {
        expect(res.body.errors).toContainEqual({
          title: 'No autorizado !',
          description: 'Por favor, inicie sesión.'
        });
      })
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});
