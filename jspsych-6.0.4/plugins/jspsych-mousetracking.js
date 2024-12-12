/**
 * jspsych-html-button-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["mousetracking"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-button-response-pmatching',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'Trial stimulus-- can be image or string'
      },
      stimulus_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'image sizes',
        default: [150, 150],
        description: "Width and height of the images that need to be chosen. Default is 40x40."
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
        
        description: 'The images to be displayed-- can be image or string.',
        
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 10000,
        description: 'How long to show the trial.'
      },
      container_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Mousetracking container size',
        default: [1000, 600],
        description: "Width and height of the container size within which the mousetracking will occur. Default is 1100x800 size sinze 4x3 is the typical computer screen size."
      },
      time_res: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Mousetracking time resolution',
        default: 5,
        description: "After how many miliseconds should x-y coordinates be sampled? If time_dim is 20, X and Y coordinates of the mouse will be sampled every 20 miliseconds. This is essentially the time resolution of mouse tracking."
      },
      eventMonitor: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Event monitor",
        default: 'click',
        description: 'What mouse event to monitor?'
      },
      location: {
      type:  jsPsych.plugins.parameterType.INT,
      pretty_name: "location",
      default: [0,0] ,
      description: 'location of the buttons'
      },
      hold_duration:{
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial Hold Duration',
        default: 200,
        description: 'How long to hold the mouse over .'
      },
      size:{
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus Size',
        default: 40,
        description: 'Size of the stimulus'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var cont_width = trial.container_size[0]
    var cont_height = trial.container_size[1]

    // display stimulus
    display_element.innerHTML += '<div id="mousetracking-container" style= "border:2px solid transparent; border-color: #ccc; position: relative; width:' + cont_width+ 'px; height:' + cont_height+ 'px"></div>';

    var paper = display_element.querySelector("#mousetracking-container");

    //display buttons
    paper.innerHTML += '<div id="jspsych-mousetracking-btngroup">';
    var str = ""
    paper.innerHTML +=  '<div class="jspsych-btn-fb"  style="border:none;background-color:hsl('+trial.color[0]+' '+trial.color[1]+' '+trial.color[2]+');display: inline-block; position: absolute; top:'+trial.location[1]+'px; right:' + trial.location[0]+'px; width: '+trial.size[0]+'px; height:'+trial.size[0]+'px" id="mousetracking-button-' + 0 +'" data-choice="'+0+'">'+str+'</div>';
   
    if( trial.choices.length==2){
      var str = ""
      paper.innerHTML +=  '<div class="jspsych-btn-fb" style="border:none;background-color:hsl('+trial.color[3]+' '+trial.color[4]+' '+trial.color[5]+');display: inline-block; position: absolute; top:'+trial.location[3]+'px; right:' + trial.location[2]+'px; width: '+trial.size[1]+'px; height:'+trial.size[1]+'px" id="mousetracking-button-' + 1 +'" data-choice="'+1+'">'+str+'</div>';

    }
    

    paper.innerHTML += '<div id="jspsych-mousetracking-stimulus" style = " position: absolute; bottom:px; left:0px"><img style="width:0px; height:0px" ></div>';

    paper.innerHTML += '</div>';


    // start time
    var start_time = Date.now();


XmousePos = []
YmousePos = []
time = []
numMouse=0
var m_pos_x,m_pos_y;
window.onmouseover = function(e) { m_pos_x = Math.round(e.pageX-$(paper).offset().left); m_pos_y = Math.round(e.pageY-$(paper).offset().top); }
XmousePos.push(m_pos_x)
YmousePos.push(m_pos_y)
time.push(Date.now()-start_time)
var mouseInterval = setInterval(function() {
      XmousePos.push(m_pos_x)
      YmousePos.push(m_pos_y)
      time.push(Date.now()-start_time)
      numMouse+=1
    },
    trial.time_res);


//
    // add event listeners to buttons
    for (var i = 0; i < trial.choices.length; i++) {
      // display_element.querySelector('#mousetracking-button-' + i).addEventListener(trial.eventMonitor, function(e){
      // var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
      // after_response(choice)});}
      if(trial.eventMonitor == 'click'){
        display_element.querySelector('#mousetracking-button-' + i).addEventListener(trial.eventMonitor, function(e){
          var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
          after_response(choice)
        });}
      if(trial.eventMonitor == 'mouseover'){
        date=1
        
        // display_element.querySelector('#mousetracking-button-' + i).addEventListener(trial.eventMonitor, function(e){
        //   var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
        //   after_response(choice)});}
        if(i==0){
          display_element.querySelector('#mousetracking-button-' + i).addEventListener(trial.eventMonitor, hold_mouse);// display_element.querySelector('#mousetracking-button-' + i).addEventListener('mouseout',function(){clearTimeout(timer);date=null},false);
          display_element.querySelector('#mousetracking-button-' + i).addEventListener('mouseout', exit_mouse);}// display_element.querySelector('#mousetracking-button-' + i).addEventListener('mouseout',function(){clearTimeout(timer);date=null},false);
         
        }
        
      // }
    }
      
      
      
      // if(trial.eventMonitor == 'xxx'){
      //   let date = null
      //   let timer
      //   display_element.querySelector('#mousetracking-button-' + i).addEventListener(trial.eventMonitor, function(e){
      //     if(!date) date = new Date()
      //       timer = setInterval(()=>{
      //           if((new Date() - date) >= 4000) {
      //           console.log('Do Action')
      //           clearInterval(timer)
      //           }
      //       }, 1000)
      //   var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
      //   after_response(choice);
      // },false);
      // display_element.querySelector('#mousetracking-button-' + i).addEventListener("mouseout", function () {
      //   clearInterval(timer)
      //   date = null})
    // }

    // store response
    var response = {
      rt: null,
      button: 'Timeout'
      
    };

    // function to handle responses by the subject
    function after_response(choice) {
      // measure rt
      
      var end_time = Date.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;
    //  console.log(response.button)

    //  console.log(XmousePos, YmousePos, time)

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-mousetracking-stimulus').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.mousetracking-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }
      if(choice==trial.broke_window_label){
        
        display_element.innerHTML = '';
        // sleep(3000).then(() => { end_trial(); });
        end_trial();
      }
      if(choice!=trial.broke_window_label){ end_trial();}
    };
    // function hold_mouse(){
    //   if(!date){date = Date.now()}
      
    //   timer = setTimeout(function(){
    //     if(date-Date.now()>1000){
    //       var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
    //       after_response(choice)
    //     }
        
    //     hold_mouse();
    // }, 1000); }
    // function hold_mouse(e){}
      
    function hold_mouse(e){ 
      var choice = trial.choices[e.currentTarget.getAttribute('data-choice')];
      timer = setInterval(function(){
        
        if(date==1){date=Date.now()}
        if(Date.now()-date>trial.hold_duration){ // don't use dataset for jsdom compatibility
          
          // if(trial.epoch!='decision'){
          //   choice = ;}
          // else{var choice ="Target";}
            
          after_response(choice)
          date=1
          clearInterval(timer)
      
      }
      },1)
      }
    function exit_mouse(e){
      
      var choice = trial.broke_window_label
      clearInterval(timer)
      date=1
      if(trial.epoch!="ITI"){
      after_response(choice)}
    }
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();
      // Get a reference to the last interval + 1
      const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

      // Clear any timeout/interval up to that id
      for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
      }
      // jsPsych.pluginAPI.clearAllIntervals();
      clearInterval(mouseInterval)

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "epoch":trial.epoch,
        "stimulus": trial.stimulus,
        "choice": response.button,
        "x-position": XmousePos,
        "y-position": YmousePos,
        "mice-times": time,
        "nRecordings": numMouse
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      
      jsPsych.finishTrial(trial_data);
    };

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        if(trial.epoch=='decision'){response.button= trial.broke_window_label}
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
