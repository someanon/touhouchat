w = require('../lib/wakabamark');

exports['current room'] = function(t) {
  t.expect(1);
  t.strictEqual(w(' /b/ ','b'), '<p><a href="/b/" data-bind="click: appGoTo.bind($data, \'/b/\')">/b/</a></p>');
  t.done();
};

exports['current room post, long style'] = function(t) {
  t.expect(1);
  t.strictEqual(w(' /b/123/ ','b'), '<p><a href="/b/123/" data-bind="click: appGoTo.bind($data, \'/b/123/\')">/123/</a></p>');
  t.done();
};

exports['current room post, short style'] = function(t) {
  t.expect(1);
  t.strictEqual(w(' /123/ ','b'), '<p><a href="/b/123/" data-bind="click: appGoTo.bind($data, \'/b/123/\')">/123/</a></p>');
  t.done();
};

exports['another room'] = function(t) {
  t.expect(1);
  t.strictEqual(w(' /rm/ ','b'), '<p><a href="/rm/" data-bind="click: appGoTo.bind($data, \'/rm/\')">/rm/</a></p>');
  t.done();
};

exports['another room post'] = function(t) {
  t.expect(1);
  t.strictEqual(w(' /rm/123/ ','b'), '<p><a href="/rm/123/" data-bind="click: appGoTo.bind($data, \'/rm/123/\')">/rm/123/</a></p>');
  t.done();
};

exports['quoted room link'] = function(t) {
  t.expect(1);
  t.strictEqual(w('&gt;/b/', 'b'), '<p><q>&gt;<a href="/b/" data-bind="click: appGoTo.bind($data, \'/b/\')">/b/</a></q></p>');
  t.done();
}

exports['URL'] = function(t) {
  t.expect(3);
  t.strictEqual(w(' http://anonchat.pw/ ','b'), '<p><a target="_blank" href="http://anonchat.pw/">http://anonchat.pw/</a></p>');
  t.strictEqual(w(' http://anonchat.pw/b/ ','b'), '<p><a target="_blank" href="http://anonchat.pw/b/">http://anonchat.pw/b/</a></p>');
  t.strictEqual(w(' http://anonchat.pw/b/123/ ','b'), '<p><a target="_blank" href="http://anonchat.pw/b/123/">http://anonchat.pw/b/123/</a></p>');
  t.done();
};
