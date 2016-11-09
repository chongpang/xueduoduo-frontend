import React from 'react';
import classNames from 'classnames';



var Activity = React.createClass({

  getInitialState: function(){
	   return {
      statements: []
    }
  },

  componentDidMount: function() {


  },
  componentWillUnmount: function() {

  },

  render() {

  	var self = this;
  	var statements = this.props.statements;

    if ( statements && statements.length > 0) {
      statements = statements.map(function (obj) {

        var actor = "", verb = "", object = "", result = "";

        if(obj.statement.actor && obj.statement.actor.name){
            actor = obj.statement.actor.name;
        }

        if(obj.statement.verb && obj.statement.verb.display){
            verb = obj.statement.verb.display;
            if(verb['zh-CN']){
              verb = verb['zh-CN'];
            }
        }

        if(obj.statement.object && obj.statement.object.definition && obj.statement.object.definition.name){
            object = obj.statement.object.definition.name;
            if(object['zh-CN']){
              object = object['zh-CN'];
            }
        }

        if(obj.statement.result){
            result = obj.statement.result.success;
            if(result){
                result = "OK!";
            }else{
                result = "Failed!";
            }
        }

        if(actor && verb){
          var timestamp = moment(obj.statement.timestamp).format("dddd, MMMM Do YYYY, h:mm:ss A");
          return (
              <TimelineView className='tl-blue'>
                <TimelineItem>
                  <TimelineHeader>
                    <TimelineIcon className='bg-blue fg-white' glyph='icon-fontello-chat-1' />
                    <TimelineTitle>
                { timestamp }
                    </TimelineTitle>
                  </TimelineHeader>
                  <TimelineBody>
                    <ul>
                      <li>
                        { actor } { verb } { object } { result }
                      </li>
                    </ul>
                  </TimelineBody>
                </TimelineItem>
              </TimelineView>
          );
        }
      });
    }

    return(
    		<PanelBody className='text-center'>
    		{ statements }
    		</PanelBody>
    	);

  }
});

module.exports = Activity;
