import React, { Component } from 'react';

import config from './config.json';
import Strings from './assets/Strings.js';
import { generateSignature } from './lib/TokenService.js';

class TableRow extends Component {
  constructor(props) {
    super(props);
    this.viewJacket = this.viewJacket.bind(this);
  }

  viewJacket() {
    const jid = this.props.jid;
    this.props.history.push(`/jacket/${jid}`);
  }

  renderDegrees(x) {
    x = Math.abs(x);
    const d = Math.floor(x);
    x -= d;
    x *= 60.0;
    const m = Math.floor(x);
    x -= m;
    x *= 60.0;
    const s = x;
    return `${d}° ${m}′ ${s.toFixed(1)}″`;
  }

  renderLatLng(lat, lng) {
    if (!lat || !lng) { return 'None'; }
    const northSouth = lat > 0.0 ? Strings.north : Strings.south;
    const eastWest = lng > 0.0 ? Strings.east : Strings.west;
    return `${this.renderDegrees(lat)} ${northSouth} ${this.renderDegrees(lng)} ${eastWest}`;
  }

  render() {
    const {
      fullname,
      expedition,
      jacketnumber,
      created,
      formation,
      locality,
      lat,
      lng,
      specimentype,
    } = this.props;
    return (
      <tr onClick={this.viewJacket}>
        <td className="creator">{fullname}</td>
        <td className="expedition">{expedition}</td>
        <td className="jacketId">{jacketnumber}</td>
        <td className="created">{new Date(created).toISOString()}</td>
        <td className="formation">{formation}</td>
        <td className="locality">{locality}</td>
        <td className="latLng">{this.renderLatLng(lat, lng)}</td>
        <td className="specimenType">{specimentype}</td>
      </tr>
    );
  }
}

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      allRows: [],
      expeditions: [],
    };
    this.credentials = JSON.parse(sessionStorage.getItem('user:credentials'));
    this.filterByExpedition = this.filterByExpedition.bind(this);
  }

  itemUrl = (path) => {
    const { uid, token } = this.credentials;
    const now = Date.now();
    const hmac = generateSignature({ uid: uid, time: now, path: path }, token);
    const urlBase = `https://${config.domain}/api${path}`;
    const urlQuery = `uid=${uid}&time=${now}&hmac=${encodeURIComponent(hmac)}`;
    return `${urlBase}?${urlQuery}`;
  };

  checkResponse = (res) => {
    if (!res.ok) { throw { code: res.status, message: res.statusText }; }
    return res.json();
  };

  fetchItem = (path) => {
    return new Promise((resolve, reject) => {
      fetch(this.itemUrl(path))
        .then(this.checkResponse)
        .then((item) => resolve(item))
        .catch((err) => reject(err));
    });
  };

  fetchJackets = async () => {
    try {
      const jackets = await this.fetchItem('/jacket');
      const expeditions = jackets.map((jacket) => jacket.expedition).filter((value, index, self) => (self.indexOf(value) === index));
      expeditions.sort();
      this.setState({ rows: jackets, allRows: jackets, expeditions: expeditions });
    }
    catch (err) {
      this.setState({ rows: [] });
      alert(`${Strings.fetchErrorMessage}: ${JSON.stringify(err)}`);
    }
  };

  componentDidMount() {
    this.fetchJackets();
  }

  filterByExpedition = (e) => {
    const expedition = e.target.value;
    if (expedition === '--all--') { this.setState({ rows: this.state.allRows }); }
    else { this.setState({ rows: this.state.allRows.filter((jacket) => (jacket.expedition===expedition)) }); }
  };

  sortBy = (key) => {
    this.setState((state) => ({
      rows: this.state.rows.sort((a, b) => (a[key] > b[key]) ? 1: -1)
    }));
  };

  render() {
    const rows = this.state.rows.map((row) => (
      <TableRow key={row.jid} history={this.props.history} {...row} />
    ));
    const filterOptions = this.state.expeditions.map((expedition) => (
      <option key={expedition} value={expedition}>{expedition}</option>
    ));
    return (
      <div className="table-responsive">
        <div><h3>{Strings.tableTitle}</h3></div>
        <div className="form-group col-md-4">
          <label htmlFor="filter-select">{Strings.filterByExpedition}</label>
          <select className="form-control" id="filter-select" onChange={this.filterByExpedition}>
            <option value="--all--">{Strings.allJackets}</option>
            {filterOptions}
          </select>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => this.sortBy('creator')}>{Strings.creator}</th>
              <th onClick={() => this.sortBy('expedition')}>{Strings.expedition}</th>
              <th onClick={() => this.sortBy('jacketnumber')}>{Strings.jacketId}</th>
              <th onClick={() => this.sortBy('created')}>{Strings.created}</th>
              <th onClick={() => this.sortBy('formation')}>{Strings.formation}</th>
              <th onClick={() => this.sortBy('locality')}>{Strings.locality}</th>
              <th onClick={() => this.sortBy('lat')}>{Strings.latLng}</th>
              <th onClick={() => this.sortBy('specimentype')}>{Strings.specimenType}</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
