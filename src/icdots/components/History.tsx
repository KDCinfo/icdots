import * as React from 'react';
import '../../App.css';

class History extends React.Component {
  render() {
    return (
      <code>
        // History

        [2018-01-21]<br/>
        - Last entry from working JavaScript version<br/>
          https://codepen.io/KeithDC/pen/rpKrgK<br/>
        - Game play is completed. Ready for play.<br/>
          - Integrated plays with board.<br/>
          - Allow player to change board background color.<br/><br/>

        [2018-01-22]<br/>
        - Setup React Components - High level<br/>
        - Setup local w/ VS Code<br/>
          (while I still prefer ST3, VS Code has the<br/>
          best TypeScript support; mostly its insights.)<br/><br/>

        [2018-01-23]<br/>
        - Aligning the GameTip (tooltip) is... as done as it's gonna be.<br/>
        - Board sizing 'up and down' is done (2-7).<br/>
          Added backup logic for non input->number support (especially min and max).<br/>
        - Adding and removing player name input fields is done.<br/>
        - Highlighting tooltip with 'mins and maxes' is done.<br/><br/>

        [2018-01-24]<br/>
        - Been looking into running prototype object instances in a React app
          (or is React in lieu of a prototypal approach?)<br/>
          - According to one guru in the FED Slack, it should be possible.<br/>
        - I've started running through the code, and I'm likely just to use React directly.<br/>
          - All the prototype instance was doing was a little state management and some functions.<br/>
        - Got precheck function near done.<br/>
        - Gonna call it a night (er, morning; @7:50 AM).<br/><br/>

        [2018-01-26] @7:00 AM - Just finished getting the 'clicked' lines to show up.<br/>
        - That was likely (hopefully) the last major challenge.

        [2018-01-26] @10:25 AM - On my 3rd day without sleep.<br/>
        - Having issues with a mixture of events, props, states, child components, scope, and timing; primarily
          between maintaining the grid node states between clicks, between the child `gameBoard` and parent `Icdots`
          components.<br/>
        - I believe I'll need to finish this over the weekend. So close! Can always use that extra weekend :)<br/>
        - Just need to figure out the grid approach (I've moved it from the child to the parent component,
          but it needs to trigger stuff in the child, so... having fun figuring it all out.<br/>

        [2018-01-26] @11:50 PM - Decided on a couple paths;<br/>
        - 1. <b>Compartmentalize</b>: In my local dev env I've split the components into their own file modules.<br/>
        - 2. <b>Visualize</b>: I will spend the weekend diagramming the process flow using draw.io, as I did with my
           <a href="https://github.com/KDCinfo/done-for-now/">&quot;Done (for now)&quot; multi-timer web app</a>.<br/>
           <br/>

        [2018-01-27] @12:40 AM - Found the 'everything is broken' error.<br/>
        - Everything works again except scoring, player turns, and ending games properly.<br/><br/>

        [2018-01-28] @7:15 AM - Got the box numbering fixed and working!<br/>
        - Woot! That was a bit painful, but good learning experience on the architecture side.<br/>
        - I also had to work up a new calculation for the box node numbering.<br/>
        - I did do a process flow, but alas, it's more of a schematic layout than a flow.<br/>
        - But it was still useful in laying it all out,
          and I'll provide a link when I finalize it and find its home (will likely be post-mortem).<br/><br/>

        - Remaining:<br/>
          1. Add and change Player turns (visually).<br/>
          2. Update player scores (visually).<br/><br/>

        [2018-01-28] @12:00 PM - Got names, player turns, and scoring all completed!<br/>
        - It's all done local, so will need to transfer my code here to CodePen.<br/>
        - Will complete tonight after running errands and taking care of some stuff
          (if I can stay awake that long after another all-nighter).<br/><br/>

        - Remaining:<br/>
          1. Complete background color changer.<br/>
          2. Adjust 'player numbers' in boxes (they're a little high).<br/>
          3. Migrate code from local env to CodePen.<br/><br/>

        [2018-01-28] @5:50 PM - Game is complete!<br/>
        - Not! Issues arose on all board sizes except 3. A litle recalc here; a little refactor there...<br/><br/>

        [2018-01-28] @8:50 PM - Game is now complete!<br/>
        - And has been transferred to CodePen. This CodePen is now live with a working version
          of ICDots written with React and TypeScript! :) I'll work on the background color changer tomorrow.<br/><br/>

        [2018-01-29] @11:00 AM - Game board color changing now works.<br/><br/>
      </code>
    );
  }
}

export default History;