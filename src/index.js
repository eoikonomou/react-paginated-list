import React from 'react';
import {
  List, Paper, ListItem, Button, TextField, withStyles,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PropTypes from 'prop-types';
import calculatePages from './paginatedListUtils';

const stepSelect = { maxWidth: 100 };
const pager = { display: 'flex', alignItems: 'center' };
const pageList = { display: 'flex', margin: 10 };
const pageListItem = { width: 40, cursor: 'pointer', justifyContent: 'center' };

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
});

class PaginatedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 10,
      currentPage: 0,
    };
  }

  goToPreviousPage = () => this.setState(prevState => ({ currentPage: prevState.currentPage - 1 }));

  goToNextPage = () => this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));

  selectPageHandler = page => () => {
    if (!this.isPageDisabled(page)) {
      this.setState({ currentPage: page - 1 });
    }
  };

  stepChangeHandler = e => this.setState({ step: Number(e.target.value) });

  isPageDisabled = (page) => {
    const { currentPage } = this.state;
    return [currentPage - 1, '...'].includes(page);
  }

  goToFirstPage = () => this.setState({ currentPage: 0 });

  goToLastPage = numberOfPages => () => {
    this.setState({ currentPage: numberOfPages - 1 });
  }

  render() {
    const { currentPage, step } = this.state;
    const { items, classes, maxHeight } = this.props;
    const numberOfPages = Math.ceil(items.length / step);
    const pages = calculatePages(numberOfPages, currentPage + 1);
    const style = { maxHeight };
    const listStyle = { maxHeight: 0.9 * maxHeight, overflow: 'auto' };
    return (
      <Paper style={style}>
        <Paper key="list" style={listStyle}>
          <List>
            {items.slice(step * currentPage, step * currentPage + step - 1)}
          </List>
          <style key="pager-style">{'.list-horizontal-display > div {display: inline-block;}'}</style>
        </Paper>
        <Paper key="pager" style={pager}>
          <Button onClick={this.goToFirstPage} disabled={currentPage === 0}>
            <SkipPreviousIcon />
          </Button>
          <Button onClick={this.goToPreviousPage} disabled={currentPage === 0}>
            <NavigateBeforeIcon />
          </Button>
          <List style={pageList}>
            {pages.map(page => (
              <ListItem
                onClick={this.selectPageHandler(page)}
                selected={currentPage === page - 1}
                style={pageListItem}
              >
                {page}
              </ListItem>
            ))}
          </List>
          <Button onClick={this.goToNextPage} disabled={currentPage === numberOfPages - 1}>
            <NavigateNextIcon />
          </Button>
          <Button
            onClick={this.goToLastPage(numberOfPages)}
            disabled={currentPage === numberOfPages - 1}
          >
            <SkipNextIcon />
          </Button>
          <div style={pager}>
            <div>Show </div>
            <TextField
              id="stepSelect"
              select
              style={stepSelect}
              className={classes.textField}
              value={step}
              onChange={this.stepChangeHandler}
              SelectProps={{
                native: true,
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
              variant="outlined"
            >
              <option key={10} value={10}>
                10
              </option>
              <option key={20} value={20}>
                20
              </option>
              <option key={50} value={50}>
                50
              </option>
              <option key={100} value={100}>
                100
              </option>
            </TextField>
            <div> items</div>
          </div>
        </Paper>
      </Paper>
    );
  }
}

PaginatedList.defaultProps = {
  items: [],
  maxHeight: '100%',
};

PaginatedList.propTypes = {
  items: PropTypes.array,
  maxHeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaginatedList);
