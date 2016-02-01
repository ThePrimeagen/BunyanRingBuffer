var RingBuffer = require('./../');
var Logger = require('bunyan');
var assert = require('chai').assert;

describe('RingBuffer', function (t) {
    it('uses bunyan logger as a readable stream into RingBuffer', function() {
        var ringbuffer = new RingBuffer({ 'limit': 5 });
        var log1 = new Logger({
            name: 'log1',
            streams: [
                {
                    stream: ringbuffer,
                    type: 'raw',
                    level: 'info'
                }
            ]
        });
        log1.info('hello');
        log1.trace('there');
        log1.error('android');

        assert.equal(ringbuffer.size(), 2);
        assert.equal(ringbuffer.get(0).msg, 'hello');
        assert.equal(ringbuffer.get(1).msg, 'android');
        assert.equal(ringbuffer.getLatest(0).msg, 'android');
        assert.equal(ringbuffer.getLatest(1).msg, 'hello');
        log1.error('one');
        log1.error('two');
        log1.error('three');
        assert.equal(ringbuffer.size(), 5);
        log1.error('four');
        assert.equal(ringbuffer.size(), 5);
        assert.equal(ringbuffer.get(0).msg, 'android');
        assert.equal(ringbuffer.get(1).msg, 'one');
        assert.equal(ringbuffer.get(2).msg, 'two');
        assert.equal(ringbuffer.get(3).msg, 'three');
        assert.equal(ringbuffer.get(4).msg, 'four');
        assert.equal(ringbuffer.getLatest(0).msg, 'four');
        assert.equal(ringbuffer.getLatest(1).msg, 'three');
        assert.equal(ringbuffer.getLatest(2).msg, 'two');
        assert.equal(ringbuffer.getLatest(3).msg, 'one');
        assert.equal(ringbuffer.getLatest(4).msg, 'android');
    });
});
