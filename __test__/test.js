 var _ = require('lodash')   
const commentArr = [
  { "name": "root2",
    "_id": "root2_id"},
   {
      "name":"root",
      "_id":"root_id",
   },
   {
      "name":"a1",
      "parent":{
         "_id":"root_id",
      },
      "_id":"a1_id",
   },
   {
      "name":"a2",
      "parent":{
         "_id":"a1_id",
      },
      "_id":"a2_id",
   },
   {
      "name":"a3",
      "parent":{
         "_id":"a2_id",
      },
      "_id":"a3_id",
   },
   {
      "name":"b1",
      "parent":{
         "_id":"root_id",
      },
      "_id":"b1_id",
   },
   {
      "name":"b2",
      "parent":{
         "_id":"b1_id",
      },
      "_id":"b2_id",
   },
   {
      "name":"b3",
      "parent":{
         "_id":"b1_id",
      },
      "_id":"b3_id",
   }
]

const commentNested = [
  {
    "name": "root2",
    "_id": "root2_id",
    "children": []
  },
  {
    "name": "root",
    "_id": "root_id",
    "children": [
      {
        "name": "a1",
        "_id": "a1_id",
        "children": [
          {
            "name": "a2",
            "_id": "a2_id",
            "children": [
              {
                "name": "a3",
                "_id": "a3_id",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "name": "b1",
        "_id": "b1_id",
        "children": [
          {
            "name": "b2",
            "_id": "b2_id",
            "children": []
          },
          {
            "name": "b3",
            "_id": "b3_id",
            "children": []
          }
        ]
      }
    ]
  }
]

    var buildTree = function(array, parent, tree) {
      var self = this
      tree = typeof parent !== 'undefined' ? tree : []
      parent = typeof parent !== 'undefined' ? parent : { _id: 0 }

      var replies = _.filter(array, function (child) {
        return child.parent == parent._id
      })

      if (!_.isEmpty(replies)) {
        if ( parent._id == '0' ) {
          tree = replies
        } else {
          parent['replies'] = replies
        }
        _.each(replies, function(child) {
          buildTree(array, child)
        })
      }
      return tree
    }
  
console.log(buildTree(commentArr))