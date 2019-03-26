import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BasicInfo from './BasicInfo';
import FamilyHistory from './FamilyHistory';
import Questions from './Questionss';
import Review from './Review';

import showResults from "../showResults";

class Forms extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.state = {
      page: 1,
    };
    this.onSubmit = {showResults};
  }
  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  render() {
    const { onSubmit } = this.props;
    const { page } = this.state;
    return (
      <div>
        {page === 1 && <BasicInfo onSubmit={this.nextPage} />}
        {page === 2 &&
          <FamilyHistory
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
          />}
        {page === 3 &&
          <Questions
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
          />}
        {page === 4 &&
          <Review
            previousPage={this.previousPage}
            onSubmit={onSubmit}
          />}
      </div>
    );
  }
}

Forms.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Forms;
