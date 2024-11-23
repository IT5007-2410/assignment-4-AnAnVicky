import React from 'react';
import { Table, Row } from 'react-native-table-component';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
  View,
} from 'react-native';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
      /****** Q4: Start Coding here. State the correct IP/port******/
      const response = await fetch('http://10.0.2.2:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      console.error('Network error:', e); // print the error
      alert(`Error in sending data to server: ${e.message}`);
    }
  }
  const columnWidths = [40, 80, 80, 80, 100, 60, 100];

class IssueFilter extends React.Component {
    constructor() {
      super();
      this.state = { owner: "" }; // add the owner state
      this.handleChange = this.handleChange.bind(this);
      this.handleFilter = this.handleFilter.bind(this);
    }
  
    handleChange(value) {
      this.setState({ owner: value }); // update the owner state
    }
  
    handleFilter() {
      const filter = {};
      if (this.state.owner) {
        filter.owner = this.state.owner; // add the owner filter
      }
      this.props.onFilter(filter); // call the onFilter method
    }    
  
    render() {
      return (
        <View>
        {/****** Q1: Start Coding here. ******/}
          <TextInput
            placeholder="Filter by Owner"
            value={this.state.owner}
            onChangeText={this.handleChange}
          />
          <Button title="Apply Filter" onPress={this.handleFilter} />
        {/****** Q1: Code ends here ******/}
        </View>
      );
    }
}
  
const styles = StyleSheet.create({
  container: {
    // remove the flex: 1
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  horizontalScroll: {
    marginBottom: 10,
  },
  header: {
    height: 50,
    backgroundColor: '#537791',
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  dataWrapper: {
    marginTop: -1,
    maxHeight: 400,
  },
  row: {
    height: 60,
    backgroundColor: '#E7E6E1',
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
});

const width= [40,80,80,80,80,80,200];

  
function IssueTable(props) {
  const tableHead = ['ID', 'Title', 'Status', 'Owner', 'Created', 'Effort', 'Due'];
  const issueRows = props.issues.map(issue => <IssueRow key={issue.id} issue={issue} />);
{/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
  return (
    <ScrollView horizontal={true} style={styles.horizontalScroll}>
      <View style={styles.container}>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          {/* table header */}
          <Row
            data={tableHead}
            style={styles.header}
            textStyle={styles.headerText}
            widthArr={columnWidths} // apply column widths
          />
          {/* table data */}
          <ScrollView style={styles.dataWrapper}>
            {issueRows}
          </ScrollView>
        </Table>
      </View>
    </ScrollView>
  );
{/****** Q2: Code Ends here.******/}
}

function IssueRow(props) {
  const issue = props.issue;
  {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
  const rowData = [
    issue.id.toString(),
    issue.title,
    issue.status,
    issue.owner,
    issue.created.toDateString(),
    issue.effort ? issue.effort.toString() : '',
    issue.due ? issue.due.toDateString() : 'N/A',
  ];
{/****** Q2: Coding Ends here.******/}
  return (
    <Row
      data={rowData}
      style={styles.row}
      textStyle={styles.text}
      widthArr={columnWidths} // apply column widths
    />
  );
}


  
class IssueAdd extends React.Component {
  constructor() {
    super();
    this.state = { title: "", owner: "", effort: "", due: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
/****** Q3: Start Coding here. Create State to hold inputs******/
  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  handleSubmit() {
    const { title, owner, effort, due } = this.state;
    if (title && owner && effort && due) {
      const parsedEffort = parseInt(effort, 10); // convert to number
      if (isNaN(parsedEffort)) {
        alert("Effort must be a valid number!");
        return;
      }
  
      const issue = {
        title,
        owner,
        effort: parsedEffort, // ensure it's a number
        created: new Date(),
        due: new Date(due), // convert to date
        status: "New",
      };
      this.props.createIssue(issue);
      this.setState({ title: "", owner: "", effort: "", due: "" }); // clear the fields
    } else {
      alert("All fields are required!");
    }
  }  

  render() {
    return (
      <View>
        <TextInput
          placeholder="Title"
          value={this.state.title}
          onChangeText={(value) => this.handleChange("title", value)}
        />
        <TextInput
          placeholder="Owner"
          value={this.state.owner}
          onChangeText={(value) => this.handleChange("owner", value)}
        />
        <TextInput
          placeholder="Effort"
          value={this.state.effort}
          onChangeText={(value) => this.handleChange("effort", value)}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Due Date (YYYY-MM-DD)"
          value={this.state.due}
          onChangeText={(value) => this.handleChange("due", value)}
        />
        <Button title="Add Issue" onPress={this.handleSubmit} />
        {/****** Q3: Code Ends here. ******/}
      </View>
    );
  }
}


class BlackList extends React.Component {
  constructor() {
    super();
    this.state = { name: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
/****** Q4: Start Coding here. Create State to hold inputs******/
  handleChange(value) {
    this.setState({ name: value });
  }

  async handleSubmit() {
    const { name } = this.state;
    if (name) {
      const query = `mutation addToBlacklist($name: String!) {
        addToBlacklist(nameInput: $name)
      }`;
      await graphQLFetch(query, { name });
      this.setState({ name: '' }); // clear the input
    } else {
      alert('Please in the name！');
    }
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Input the owner name"
          value={this.state.name}
          onChangeText={this.handleChange}
          style={styles.input}
        />
        <Button title="Add to the blacklist" onPress={this.handleSubmit} />
      {/****** Q4: Code Ends here. ******/}
      </View>
    );
  }
}


export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [], filter: {} };
    this.createIssue = this.createIssue.bind(this);
    this.applyFilter = this.applyFilter.bind(this); // ensure the context of this
  }  

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query issueList($filter: IssueFilterInputs) {
      issueList(filter: $filter) {
        id title status owner created effort due
      }
    }`;
  
    const variables = { filter: this.state.filter }; // pass the filter to the query
    const data = await graphQLFetch(query, variables);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }  

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
      issueAdd(issue: $issue) {
        id
      }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    }
  }

  applyFilter(filter) {
    this.setState({ filter }, () => this.loadData()); // update the filter and call loadData
  }

  render() {
    return (
      <View>
        {/****** Q1: Start Coding here. ******/}
        <IssueFilter onFilter={this.applyFilter} />
        {/****** Q1: Code ends here ******/}

        {/****** Q2: Start Coding here. ******/}
        <IssueTable issues={this.state.issues} />
         {/****** Q2: Code ends here ******/}

         {/****** Q3: Start Coding here. ******/}
        <IssueAdd createIssue={this.createIssue} />
        {/****** Q3: Code Ends here. ******/}

        {/****** Q4: Start Coding here. ******/}
        <BlackList />
        {/****** Q4: Code Ends here. ******/}
      </View>
    );
  }
}

export { IssueFilter, IssueTable, IssueAdd, BlackList };
