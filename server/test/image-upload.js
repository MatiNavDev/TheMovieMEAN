const request = require('supertest');
const expect = require('expect');
const formData = require('form-data');
const _ = require('lodash');
const path = require('path');


const fs = require('fs');
const s3Service = require('../services/s3/index');
const { app } = require('../index');


/**
 * Limpia todas las imagenes almacenadas en el s3 bucket
 * @param {*} params 
 */
function cleanAll() {
    before((done)=>{
        s3Service.imageDelete()
        .then(res=>{
            done()
        })
        .catch(e=>done(e));
    });
}



describe('IMAGE-UPLOAD TEST: /api/v1/image-upload', function () {
    cleanAll();


    it('should update correctly an image', (done) => {
        this.timeout(5000);

        const imagePath = path.join(__dirname, '..', '/assets/test/Image.jpg')

        request(app)
            .post('/api/v1/image-upload')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YmM3YWVkOGQ5MzBlMjA4OWQ4MjM5ZjMiLCJ1c2VybmFtZSI6InVzZXJPbmUiLCJpYXQiOjE1Mzk4OTE3NjgsImV4cCI6MTUzOTg5NTM2OH0.bfzd5P4JLUxBzdzG6TS9X7WwTbO0TvnhNgoCH3OKZJQ')
            .attach('image', imagePath)
            .expect(200)
            .expect((res, err) => {
                if (err) done(err);

                expect(_.isString(res.body.imageUrl)).toBeTruthy();
            })
            .end((err) => {
                if (err) return done(err);
                done();
            });

    });


    it('should reject with not authorized error', (done)=>{

        request(app)
        .post('/api/v1/image-upload')
        .set('Authorization', 'Bearer ')
        .expect(422)
        .expect((res)=>{

            expect(res.body.errors).toContainEqual({ title: 'No autorizado !', description: 'Por favor, inicie sesión.' });
        })
        .end((err) => {
            if (err) return done(err);
            done();
        });
        
    })
})

