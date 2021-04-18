var supertest = require('supertest');
var assert = require('assert');
sinon = require('sinon');
var VarientController = require('../../api/controllers/VariantController');

require('../bootstrap.test');

var createdId = 0;
describe('VarientController', function() {

  it('should call get Variant', function(done) {
    var agent = supertest.agent(sails.hooks.http.app);
    agent
      .get('/variant')
      .send()
      .expect(200)
      .end(function(err, result) {
        if (err) {
          done(err);
        } else {
          result.body.length.should.be.aboveOrEqual(0);
          done();
        }
      });
  });

    it('Should Create variant.', (done) => {
    var agent = supertest.agent(sails.hooks.http.app);
        var param = {
            id: 2,
            name: 'test',
            type: 'Diesel',
            capacity: 6,
            price: 78
        }
        agent
        .post('/variant')
        .set('Accept', 'application/json')
        .send(param)
        .expect(200)
        .end((err, res) => {
            if (err) throw err;
            res.body.id.should.equal(2);
            res.body.name.should.equal('test');
            res.body.type.should.equal('Diesel');
            createdId = res.body.id;
            done();
        });
    });

    it('Should update variant', (done) => {
        var agent = supertest.agent(sails.hooks.http.app);
        var params = {
            name: 'Coming Home',
            type: 'Hybrid',
            capacity: 10,
            price: 75
        }
        agent
        .put('/variant/' + createdId)
        .set('Accept', 'application/json')
        .send(params)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
            res.body[0].should.have.property('id', createdId);
            res.body[0].should.have.property('name', 'Coming Home');
            res.body[0].should.have.property('type', 'Hybrid');
            res.body[0].should.have.property('capacity', 10);
            res.body[0].should.have.property('price', 75);
          done();
        });
    });

    it('should Search Variant and 200 for success', function (done) {
        var agent = supertest.agent(sails.hooks.http.app);
        agent
            .get('/variant/')
            .query('search?where={"capacity": {">=": "2000"}}')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, result) {
                if (err) {
                    return done(err);
                } else {
                    console.log('the search method is: ', result.body);
                    result.status.should.equal(200);
                    return done();
                }
            });
    });

    it('should Search Variant and fail with 404', function (done) {
        var agent = supertest.agent(sails.hooks.http.app);
        agent
            .search('/variant/search?skip=' + createdId)
            .set('Accept', 'application/json')
            .expect(404)
            .end(function (err, result) {
                if (err) {
                    return done(err);
                } else {
                    result.status.should.equal(404);
                    return done();
                }
            });
    });

    it('should delete entry', function (done) {
        var agent = supertest.agent(sails.hooks.http.app);
        agent
            .delete('/variant/' + createdId)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) {
                    return done(err);
                } else {
                    result.body.should.have.property('id', createdId);
                    result.body.should.have.property('name', 'Coming Home');
                    result.body.should.have.property('type', 'Hybrid');
                    return done();
                }
            });
    });

    it('should delete All entry', function (done) {
        var agent = supertest.agent(sails.hooks.http.app);
        agent
            .delete('/variant/')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, result) {
                if (err) {
                    return done(err);
                } else {
                    result.status.should.equal(200);
                    return done();
                }
            });
    });


});
