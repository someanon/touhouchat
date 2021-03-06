var m = require('../model');

m.init({
  model: {
    rooms_count_limit: 2,
    log_size_limit: 3,
    token_expire_time: 5, // seconds
  },
  predefinedRooms: { test: 1 }
});

function clear(exit) {
  m.c.multi()
    .del('rooms_counters')
    .del('predefined_rooms')
    .del('config')
    .del('@test')
    .exec(function() {
      if( exit ) { m.c.quit() }
    });
}

clear();

exports['create and remove user'] = function(t) {
  t.expect(6);

  m.user.create(function(err, uid) {
    t.equal(err, null, 'no error');

  m.c.hget('@'+uid, 'login', function(err, login) {
    t.equal(err, null, 'no error');
    t.equal(login, 0, 'generated user login value');

  m.user.remove(uid, function(err) {
    t.equal(err, null, 'no error');

  m.c.exists('@'+uid, function(err, exist) {
    t.equal(err, null, 'no error');
    t.equal(exist, false, 'user removed');

  t.done();
  });});});});
};

exports['login and logout user'] = function(t) {
  t.expect(6);
  
  var uid = 'test';
  m.c.hset('@test', 'login', 0, function(err) {

  m.user.login(uid, function(err) {
    t.equal(err, null, 'no error');

  m.c.hget('@'+uid, 'login', function(err, login) {
    t.equal(err, null, 'no error');
    t.equal(login, 1, 'user logined');
  
  //m.user.login(uid, function(err) {
  //  t.notEqual(err, null, 'error on multiple login using one uid');
  
  m.user.logout(uid, function(err) {
    t.equal(err, null, 'no error');
  
  m.c.hget('@'+uid, 'login', function(err, login) {
    t.equal(err, null, 'no error');
    t.equal(login, 0, 'user logined');

  t.done();
  clear(true);
  });});});});});//});
};
