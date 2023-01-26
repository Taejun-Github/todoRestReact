import { Container, List, Paper, Grid, Button, AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import AddTodo from './AddTodo';
import './App.css';
import Todo from './Todo';
import { call, signout } from "./service/ApiService";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
    };
  }

  componentDidMount() {
    call("/todo", "GET", null).then((response) => {
      this.setState({ items: response.data, loading: false });
      }
    );
  }

  add = (item) => {
    call("/todo", "POST", item).then((response) =>
      this.setState({ items: response.data, loading: false })
    );
  };

  delete = (item) => {
    call("/todo", "DELETE", item).then((response) => {
      this.setState({ items: response.data, loading: false })
    });
  };

  update = (item) => {
    call("/todo", "PUT", item).then((response) => {
      this.setState({ items: response.data, loading: false })
    });
  };
  
  render() {
    let todoItems = this.state.items.length > 0 && (
      <Paper style={{ margin: 16 }}>
        <List>
          {this.state.items.map((item, idx) => (
            <Todo 
              item={item} 
              key={item.id} 
              delete={this.delete} 
              update={this.update}/>
          ))}
        </List>
      </Paper>
    );

    let navigationBar = (
      <AppBar position='static'>
        <Toolbar>
          <Grid justifyContent='space-between' container>
            <Grid item>
              <Typography variant='h6'>오늘의 할일</Typography>
            </Grid>
            <Grid>
              <Button color='inherit' onClick={signout}>
                로그아웃
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );

    let todoListPage = (
      <div>
        {navigationBar}
        <Container maxWidth="md">
          <AddTodo add={this.add}/>
          <div className='TodoList'>{todoItems}</div>
        </Container>
      </div>
    )

    let loadingPage = <h1> 로딩중 </h1>;
    let content = loadingPage;

    if (!this.state.loading) {
      content = todoListPage;
    }
    return (
      <div className='App'>{content}</div>
    )
  }
}

export default App;
