'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import CommentBox from '../src/components/Comment/CommentBox'

jest.mock('../node_modules/react-overlays/lib/Modal.js')
import Modal from '../node_modules/react-overlays/lib/Modal.js'




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
         "id":"root_id",
      },
      "_id":"a1_id",
   },
   {
      "name":"a2",
      "parent":{
         "id":"a1_id",
      },
      "_id":"a2_id",
   },
   {
      "name":"a3",
      "parent":{
         "id":"a2_id",
      },
      "_id":"a3_id",
   },
   {
      "name":"b1",
      "parent":{
         "id":"root_id",
      },
      "_id":"b1_id",
   },
   {
      "name":"b2",
      "parent":{
         "id":"b1_id",
      },
      "_id":"b2_id",
   },
   {
      "name":"b3",
      "parent":{
         "id":"b1_id",
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

it('renders component', function() {
	const box = TestUtils.renderIntoDocument(
		<CommentBox comments={commentArr} />
	)

	const commentNode = ReactDOM.findDOMNode(box)
	commentNode.buildTree = jest.genMockFunction()

	expect(box.buildTree()).toEqual(commentNested)
})