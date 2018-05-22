require('./../config/config');
const expect = require('expect');
const request = require('supertest');
const {
    ObjectID
} = require('../db/mongo');
const {
    app
} = require('../server');
const {
    Todo
} = require('../models/Todo');
const {
    User
} = require('../models/User');
const {
    todos,
    populateTodos,
    users,
    populateUsers
} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);
describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'Test Todo text';
        request(app).post('/todos').
        send({
            text
        }).
        expect(200).
        expect((res) => {
            expect(res.body.text).toBe(text);
        }).end((error, res) => {
            if (error) {
                return done(error);
            }
            Todo.find({
                text
            }).then((todos) => {
                expect(todos.length).toBe(2);
                expect(todos[0].text).toBe(text);
                done();
            }).catch(e => done(e));
        });
    });
    it('should not create a new todo with invalid data', (done) => {

        request(app).post('/todos').
        send({}).
        expect(400).
        end((error, res) => {
            if (error) {
                return done(error);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch(e => done(e));
        });
    });
});

describe('GET /todos', () => {
    it('should list all todos', (done) => {
        request(app).get('/todos').expect(200).expect((res) => {
            expect(res.body.todos.length).toBe(2);
        }).end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return 404 if invalid id is used', (done) => {
        request(app).get('/todos/123').expect(404).end(done);
    });
    it('should return 200 with the actual todo', (done) => {
        request(app).get(`/todos/${todos[0]._id.toHexString()}`).expect(200).expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        }).end(done);
    });
    it('should return the 404 with empty todo', (done) => {
        let x = new ObjectID();
        request(app).get(`/todos/${x}`).expect(404).expect((res) => {
            expect(res.body.todo).toBe(undefined);
        }).end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should return 404 if id is invalid', (done) => {
        request(app).delete('/todos/24').expect(404).end(done);
    });
    it('should return the deleted doc with 200', (done) => {
        request(app).delete(`/todos/${todos[0]._id.toHexString()}`).expect(200).expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        }).end((err, res) => {
            if (err)
                return done(err);
            Todo.findById(todos[0]._id).then((result) => {
                expect(result).toBeFalsy();
                done();
            }).catch((e) => done(e));
        });
    });
    it('should return 404 for if todo not found', (done) => {
        let x = new ObjectID();
        request(app).delete(`/todos/${x}`).expect(404).end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        let id = todos[0]._id;
        let text = 'Updated todo';
        let completed = true;
        request(app).patch(`/todos/${id.toHexString()}`).send({
                text,
                completed
            })
            .expect(200).expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
                done();
            }).catch((e) => done(e));
    });
    it('should clear completedAt when todo is not completed', (done) => {
        let id = todos[1]._id;
        let completed = !true;
        request(app).patch(`/todos/${id.toHexString()}`).send({
                completed
            }).expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
                done();
            }).catch((e) => done(e));


    });


});

describe('GET /users/me', () => {
    it('should return if authenticated', (done) => {
        request(app).get('/users/me').set('x-auth', users[0].tokens[0].token)
            .expect(200).expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return 401 if not authenticated', (done) => {
        request(app).get('/users/me').expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            }).end(done);
    });
});

describe('POST /user', () => {
    it('should create a user', (done) => {
        let email = 'emailTest@gmail.com';
        let password = 'validPassword!';
        request(app).post('/users').send({
                email,
                password
            }).expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.email).toBe(email);
            }).end((err) => {
                if (err)
                    return done(err);
                User.findOne({
                    email
                }).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e) => done(e));
            });;
    });
    it('should return validation error if request invalid', (done) => {
        request(app).post('/users').send({
                email: 'arup@fm.com',
                password: '2'
            })
            .expect(400).expect((res) => {
                expect(res.body.name).toBe('ValidationError');
            }).end(done);
    });
    it('should not create user if email is already in use', (done) => {
        request(app).post('/users').send({
                email: users[0].email,
                password: 'abcdg4'
            })
            .expect(400).end(done);
    });
});
describe('POST /users/login', () => {
    it('should login user  and return auth token', (done) => {
        request(app).post('/users/login').send({
            email: users[1].email,
            password: users[1].password
        }).expect(200).expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
        }).end((err, res) => {
            if (err)
                return done(err);
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).toMatchObject({
                    access: 'auth',
                    token: res.headers['x-auth'],

                });
                done();
            }).catch((e) => done(e));
        });
    });
    it('should reject invalid login', (done) => {
        let invalidUser = {
            email: users[1].email,
            password: 'invalidPass'
        };
        request(app).post('/users/login').send(invalidUser).expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            }).end((err, res) => {
                if (err) return done(err);
                User.findOne({
                    email: users[1].email
                }).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});