"use strict";

var express = require('express');

var mongoose = require('mongoose');

var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors()); //define rout

app.get('/', function (req, res) {
  res.send("hello world");
}); //let Todos=[];

mongoose.connect('mongodb://localhost:27017/mern-app').then(function () {
  console.log("db connected");
})["catch"](function (err) {
  console.log(err);
}); //schema

var todoschema = new mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  description: String
}); //modal

var todomodel = mongoose.model('Todo', todoschema);
app.post('/todos', function _callee(req, res) {
  var _req$body, title, description, newtodo;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, title = _req$body.title, description = _req$body.description;
          _context.prev = 1;
          newtodo = new todomodel({
            title: title,
            description: description
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(newtodo.save());

        case 5:
          res.status(201).json(newtodo);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0);
          res.status(500).json({
            msg: _context.t0.message
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
app.put('/todos/:id', function _callee2(req, res) {
  var _req$body2, title, description, id, utodo;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, title = _req$body2.title, description = _req$body2.description;
          id = req.params.id;
          _context2.next = 5;
          return regeneratorRuntime.awrap(todomodel.findByIdAndUpdate(id, {
            title: title,
            description: description
          }, {
            "new": true
          }));

        case 5:
          utodo = _context2.sent;

          if (utodo) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "todo not found"
          }));

        case 8:
          res.json(utodo);
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: _context2.t0.message
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
app.get('/todos', function _callee3(req, res) {
  var Todos;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(todomodel.find());

        case 3:
          Todos = _context3.sent;
          res.json(Todos);
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            msg: _context3.t0.msg
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
app["delete"]('/todos/:id', function _callee4(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(todomodel.findByIdAndDelete(id));

        case 4:
          res.status(204).end();
          _context4.next = 11;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          res.status(500).json({
            msg: _context4.t0.message
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
var port = 8000;
app.listen(port, function () {
  console.log("server is listening" + port);
});