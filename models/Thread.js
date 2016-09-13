var mongoose = require('mongoose')

var ThreadSchema = new mongoose.Schema({
  text: String, 
  photoName: String,
  date: { type: Date, default: Date.now }, 
  deleted: { type: Boolean, default: false },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  proShitters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', 
                  unique: true,  dropDups: true 
                }],
  proShittees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',
                  unique: true, dropDups: true 
                }],
  likes: { type: Number, default: 0 },
  // For testing purposes, use simple Strings 
  // author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // victim: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // included: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // author: String,

  author: [{
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    real: String,
    pseudonym: String
  }],
  anonymous: Boolean,
  victim: String,
  included: [{
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String
  }]
})

ThreadSchema.methods.getLikesCount = function() {
  return this.proShitters.length - this.proShittees.length

}



module.exports = mongoose.model('Thread', ThreadSchema)
