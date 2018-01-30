import * as React from 'react';
import '../../App.css';

class Message extends React.Component {
  render() {
    return (
      <div className="message">
        <h4>This is currently a work-in-progress<br/>(so will not work until next week - 1/29 or so).</h4>
        <h4>
          <b><u>1/28/18</u> @8:50 PM</b> - Game is now complete!<br/>
            And has been transferred to CodePen. This CodePen is now live with a working version
            of ICDots written with React and TypeScript! :) I'll work on the background color changer tomorrow.<br/>
            <br/>
          <b><u>1/28/18</u> @5:50 PM</b> - Game is complete!<br/>
            Not! Issues arose on all board sizes except 3. A litle recalc here; a little refactor there...<br/>
            <br/>
          <b><u>1/28/18</u> @12:00 PM</b> - Got names, player turns, and scoring all completed!<br/>
            It's all done local, so will need to transfer my code here to CodePen.
            Will complete tonight after running errands and taking care of some stuff
            (if I can stay awake that long after another all-nighter).<br/>
            <br/>
            Remaining:
            <ul style={{marginTop: 0}}>
              <li>1. Complete background color changer.</li>
              <li>2. Adjust 'player numbers' in boxes (they're a little high).</li>
              <li>3. Migrate code from local env to CodePen.</li>
            </ul>
          <b><u>1/28/18</u> @7:15 AM</b> - Got the box numbering fixed and working!<br/>
            Woot! That was a bit painful, but good learning experience on the architecture side.
            I also had to work up a new calculation for the box node numbering.<br/>
            I did do a process flow, but alas, it's more of a schematic layout than a flow.
            But it was still useful in laying it all out,
            and I'll provide a link when I finalize it and find its home (will likely be post-mortem).<br/>
            <br/>
            Remaining:
            <ul style={{marginTop: 0}}>
              <li>1. Add and change Player turns (visually).</li>
              <li>2. Update player scores (visually).</li>
            </ul>
          <b><u>1/27/18</u> @12:40 AM</b> - Found the 'everything is broken' error.<br/>
            Everything works again except scoring, player turns, and ending games properly.<br/>
            <br/>
          <b><u>1/26/18</u> @11:50 PM</b> - Decided on a couple paths;<br/>
            1. <b>Compartmentalize</b>: In my local dev env I've split the components into their own file modules.<br/>
            2. <b>Visualize</b>: I will spend the weekend diagramming the process flow using draw.io, as I did with my
               <a href="https://github.com/KDCinfo/done-for-now/">&quot;Done (for now)&quot; multi-timer web app</a>.
            <br/>
            <br/>
          <b><u>1/26/18</u> @10:25 AM</b> - On my 3rd day without sleep.<br/>
            Having issues with a mixture of events, props, states, child components, scope, and timing; primarily
            between maintaining the grid node states between clicks, between the child `gameBoard` and parent `Icdots`
            components.<br/>
            I believe I'll need to finish this over the weekend. So close! Can always use that extra weekend :)
            Just need to figure out the grid approach (I've moved it from the child to the parent component,
            but it needs to trigger stuff in the child, so... having fun figuring it all out.<br/>
            <br/>
          <b><u>1/26/18</u> @7:00 AM</b> - Just finished getting the 'clicked' lines to show up.
            That was likely (hopefully) the last major challenge.
        </h4>
        <h4>
          I'm converting my <a href="https://codepen.io/KeithDC/pen/rpKrgK">JavaScript version</a> to
          'React with TypeScript'.
        </h4>
      </div>
    );
  }
}

export default Message;