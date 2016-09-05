import React from 'react'

//import Menu from '../Utility/Menu'
import DropdownBox from '../Utility/Dropdown'

var ThreadForm = React.createClass({
  getInitialState: function () {
    return {
            text: '', 
            included: '',
            includedArr: [],
            includedSuggestions: [],
            victim: '',
            ct: '',
            anonymous: ''
            }
  },
  onAddFile: function(res){
    this.setState({imageUrl: res.imageUrl})
    console.log(res)
    var newFile = {
      id:res.file.name,
      name:res.file.name,
      size: res.file.size,
      altText:'',
      caption: '',
      file:res.file,
      url:res.imageUrl
    };
    //this.executeAction(newImageAction, newFile);
  },
  clearState: function (field) {
    this.setState({[field]: ''})
  },
  handleTextChange: function (e) {
    this.setState({text: e.target.value})
  },
  handleAnonSubmit: function (e) {
    this.setState({anonymous: e.target.value})
  },
  handleIncludedChange: function (e) {
    this.setState({included: e.target.value})

    // Predictive friend selection
    var includedSuggestions = helpers.suggestItems(this.props.friends, e.target.value)
    this.setState({includedSuggestions: includedSuggestions})
  },
  handleVictimChange: function (e) {
    this.setState({victim: e.target.value})
  },
  handleTagged: function (tagged) {
    this.setState({includedArr: tagged})
  },
  handleSubmit: function (e) {
    e.preventDefault()
    var anonymous = this.state.anonymous
    var text = this.state.text.trim()
    var includedArr = this.state.includedArr
    var victim = this.state.victim.trim()
    console.log(includedArr)
    if (!text || includedArr.length < 1 || !victim) {
      return
    }
    this.props.onThreadSubmit({ 
                                text: text, 
                                included: includedArr,
                                victim: victim,
                                anonymous: anonymous
                              })
    this.setState({
                  text: '', 
                  included: '',
                  victim: '',
                  includedArr: [],
                  includedSuggestions: [],
                  anonymous: '',

                  })
  },
  render: function () {
    return (
    <div id="threadInputs">
      <div className="submitActions">

        </div>
      <form className="threadForm" onSubmit={this.handleSubmit}>
        <textarea
          rows='1'
          cols='48'
          className="textInput"
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange} />
        <input
          className="textInput"
          type="text"
          placeholder="Name your victim"
          value={this.state.victim}
          onChange={this.handleVictimChange} />
        <input
          className="textInput"
          type="text"
          placeholder="Who can see?"
          value={this.state.included}
          onChange={this.handleIncludedChange} />
        <br></br>
        <DropdownBox data={this.state.includedSuggestions}
                     includedArr={this.state.includedArr} 
                     handleTagged={this.handleTagged} 
                     title={ 'TAGGED' }
                     clearState={this.clearState} />
        
        <input type="radio" 
               name="anonymity" 
               onChange={this.handleAnonSubmit} 
               value="anonymous" />Anonymous
        <br></br>

        <input type="radio" 
               name="anonymity" 
               onChange={this.handleAnonSubmit} 
               value="use real name" />Real name
        <br></br>

        <input type="submit" value="Post" />
      </form>
    </div>
    )
  }
})

module.exports = ThreadForm