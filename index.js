// import the react library
import React, { Component } from 'react';
import ReactNative, { View, Text, TouchableHighlight, ListView, AppRegistry, StyleSheet} from 'react-native';
import formatTime from 'minutes-seconds-milliseconds'; 

// Create a react component
export default class CodeSharing extends Component {

  constructor(props) {
    super(props);
    
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      elapasedTime: null,
      running: false,
      startTime: null,
      started: false,
      laps: [],
      dataSource: ds.cloneWithRows([]),
    }
  }

  render() {
    return <View style={styles.container} >

        <View style={styles.top}>
            <View style={styles.timerView}>
                <Text style={styles.timer} >
                    {formatTime(this.state.timeElapsed)}
                </Text>
            </View>
            <View style={styles.buttonsView}>
                {this.lapButton()}
                {this.startStopButton()}
            </View> 
        </View> 
        <View style={styles.gap} ></View>
        <View style={styles.bottom}>
          {this.showList()}
        </View>
    </View>
  }

  showList() {
    return <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
      />
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <View style={styles.row}>
      <Text style={styles.rowText} numberOfLines={1}>Lap {parseInt(rowID) + 1} : {rowData}</Text>
      </View>
    );
  }

  startStopButton() {

    var style = this.state.running ? styles.startButton : styles.stopButton;

    return <TouchableHighlight 
    underlayColor="gray" 
    onPress={this.startPressed}
    style={[styles.button, style]}>
        <Text>
          {this.state.running ? 'Stop' : 'Start'}
        </Text>
      </TouchableHighlight>
  }

  startPressed = () => {

    if(this.state.running) {
      clearInterval(this.interval);
      this.setState({
        running: false,
      });
      return // exit from startPressed()
    }

    this.setState({
      startTime: new Date(),
      started: true,
    });

    this.interval = setInterval(() => {
      this.setState({
        timeElapsed: new Date() - this.state.startTime,
        running: true
      });
    }, 30);

  }

  lapButton() {
    return <TouchableHighlight 
    underlayColor="gray" 
    onPress={this.lapPressed}
    style={styles.button}>
        <Text>
          {this.state.running ? 'Lap' : 'Reset'}
        </Text>
      </TouchableHighlight>
  }

  lapPressed = () => {
    
    if(this.state.started == false) {
      return;
    }

    if(this.state.running == false) {

      this.setState({
        timeElapsed: null,
        started: false,
        running: false,
        laps: [],
        dataSource: this.state.dataSource.cloneWithRows([]),
      });

      return // exit from startPressed()
    }

    var lap = formatTime(this.state.timeElapsed);
    var temp = this.state.laps.concat([lap])

    this.setState({
      startTime: new Date(),
      laps: temp,
      dataSource: this.state.dataSource.cloneWithRows(temp)
    });

  }

}

//style the react component
var styles = StyleSheet.create({

  container: {
    flex: 1, // proportionality 
    //justifyContent: 'center', // vertical with column
    alignItems: 'stretch', // horizontal with column
  },

  top: {
    flex: 1, // 1:1
  },

  gap: {
    flex: 0.2,
  },

  bottom: {
    flex: 1.5, // 1:1
  },

  timerView: {
    flex: 5, // 5:8
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonsView: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // 3:8
  },

  timer: {
    fontSize: 60,
  },

  button: {
    borderWidth: 2,
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

   startButton: {
    borderColor: '#CC0000',
  },

   stopButton: {
    borderColor: '#00CC00',
  },

  lap: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },

  lapText: {
    fontSize: 30,
  },

  rowText: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  row: {
    height: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#e9e9e9',
    borderWidth: 1,
    height: 60,
  },

});
