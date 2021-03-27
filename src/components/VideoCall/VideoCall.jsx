import React from 'react';
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';
import { Button, Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default class VideoCall extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      connection: 'Connecting',
      publishVideo: true,
    };

    this.sessionEventHandlers = {
      sessionConnected: () => {
        this.setState({ connection: 'Connected' });
      },
      sessionDisconnected: () => {
        this.setState({ connection: 'Disconnected' });
      },
      sessionReconnected: () => {
        this.setState({ connection: 'Reconnected' });
      },
      sessionReconnecting: () => {
        this.setState({ connection: 'Reconnecting' });
      },
    };

    this.publisherEventHandlers = {
      accessDenied: () => {
        console.log('User denied access to media source');
      },
      streamCreated: () => {
        console.log('Publisher stream created');
      },
      streamDestroyed: ({ reason }) => {
        console.log(`Publisher stream destroyed because: ${reason}`);
      },
    };

    this.subscriberEventHandlers = {
      videoEnabled: () => {
        console.log('Subscriber video enabled');
      },
      videoDisabled: () => {
        console.log('Subscriber video disabled');
      },
    };
  }

  onSessionError = error => {
    this.setState({ error });
  };

  onPublish = () => {
    console.log('Publish Success');
  };

  onPublishError = error => {
    this.setState({ error });
  };

  onSubscribe = () => {
    console.log('Subscribe Success');
  };

  onSubscribeError = error => {
    this.setState({ error });
  };

  toggleVideo = () => {
    this.setState(state => ({
      publishVideo: !state.publishVideo,
    }));
  };

  render() {
    const { apiKey, sessionId, token } = this.props.credentials;
    const { error, connection, publishVideo } = this.state;
    return (
      <div style={{alignContent: "center", alignItems: "center"}}>
          <Grid style={{marginLeft: "40%"}} xs={4} sm={4}>
              <Alert severity="info">You are currently inside a video conference !</Alert>
          </Grid>
          
        <Typography variant="h4" align="center"  id="sessionStatus">Session Status: {connection}</Typography>
        {error ? (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        ) : null}
        <OTSession
        
          apiKey={apiKey}
          sessionId={sessionId}
          token={token}
          onError={this.onSessionError}
          eventHandlers={this.sessionEventHandlers}
        >
            
            <div style={{display: "flex", flexDirection: "column"}}>
                <OTPublisher
                properties={{ publishVideo, width: 400, height: 300, }}
                onPublish={this.onPublish}
                onError={this.onPublishError}
                eventHandlers={this.publisherEventHandlers}
            />
            <div style={{display: "flex", alignItems: 'center', marginBottom: "5%", marginLeft: "6%", marginTop: "3%"}}>
                <Button startIcon={<VideocamOffIcon/>} style={{width: "200px", height: "40px", marginRight: '5%'}} color="primary" variant="contained"  id="videoButton" onClick={this.toggleVideo}>
                {publishVideo ? 'Disable' : 'Enable'} Video
                 </Button>
                <br/>
                <Button startIcon={<ExitToAppIcon/>} style={{width: "150px", height: "40px", marginRight: '5%'}}  href="/" variant="contained" color="secondary">Exit Call</Button>
          
            </div>
            </div>
          
          <OTStreams>
              
            <OTSubscriber
              properties={{ width: 400, height: 300 }}
              onSubscribe={this.onSubscribe}
              onError={this.onSubscribeError}
              eventHandlers={this.subscriberEventHandlers}
            />
          </OTStreams>

          
        </OTSession>
      </div>
    );
  }
}
