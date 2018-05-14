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
const todos = [{
        _id: new ObjectID(),
        text: 'Test Todo text'
    },
    {
        _id: new ObjectID(),
        text: 'todo dummy 2',
        completed: true,
        completedAt: 1212121
    }
];
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
})
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