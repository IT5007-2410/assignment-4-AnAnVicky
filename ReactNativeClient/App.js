/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { IssueFilter, IssueTable, IssueAdd, BlackList } from './IssueList';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


export default class App extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }

  async createIssue(issue) {
    // eslint-disable-next-line no-param-reassign
    const newIssue = {
      ...issue,
      id: this.state.issues.length + 1,
    };
    this.setState((prevState) => ({
      issues: [...prevState.issues, newIssue],
    }));
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          <Text>Issue Tracker</Text>

          {/****** Q1: IssueFilter Placeholder *******/}
          <IssueFilter onFilter={this.applyFilter} />

          {/****** Q2: IssueTable *******/}
          <IssueTable issues={this.state.issues} />

          {/****** Q3: IssueAdd *******/}
          <IssueAdd createIssue={this.createIssue} />

          {/****** Q4: BlackList *******/}
          <BlackList />
        </ScrollView>
      </SafeAreaView>
    );
  }
}


