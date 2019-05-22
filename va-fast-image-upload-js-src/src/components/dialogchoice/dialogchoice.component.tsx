/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import './dialogchoice.component.css';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { CloudUpload, PhotoCamera } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';

export interface Props {
  onChoice(img: null|string): any;
}

export default class Dialogchoice extends React.Component<Props, any>{

  state = {
    open: true
  }

  /**
   * [constructor]
   * @param {Object} props
   */
  constructor(props: any){
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  /**
   * [handling function to close the dialog and deliver the choice value to the parent component]
   * @type {null|string} value
   */
  public handleClose(value: null|string): void{
    this.setState({ open: false });
    this.props.onChoice(value);
  }


  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={() => this.handleClose(null)}
        maxWidth={'lg'}
        className={'dialogchoice'}
      >
        <DialogTitle>{window.vafastimageupload.lang.choiceTitle}</DialogTitle>
        <DialogContent className={'content'} >
          <Grid container spacing={24}>
            <Grid item xs={6} className={'button-wrapper'}>
              <Button onClick={()=> this.handleClose('upload')} color="primary">
                <CloudUpload fontSize="large" />
              </Button>
            </Grid>
            <Grid item xs={6} className={'button-wrapper'}>
              <Button onClick={()=> this.handleClose('camera')} color="secondary">
                <PhotoCamera fontSize="large" />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }

}
