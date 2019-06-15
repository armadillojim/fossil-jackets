import React, { Component } from 'react';

import config from './config.json';
import Strings from './assets/Strings.js';
import { generateSignature } from './lib/TokenService.js';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = { jacket: {}, pids: [] };
    this.credentials = JSON.parse(sessionStorage.getItem('user:credentials'));
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

  fetchJacket = async () => {
    try {
      const jid = this.props.match.params.jid;
      const jacket = await this.fetchItem(`/jacket/${jid}`);
      this.setState({ jacket: jacket });
      const pids = await this.fetchItem(`/jacket/${jid}/photo`);
      this.setState({ pids: pids });
    }
    catch (err) {
      this.setState({ jacket: {}, pids: [] });
      alert(`${Strings.fetchErrorMessage}: ${JSON.stringify(err)}`);
    }
  };

  componentDidMount() {
    this.fetchJacket();
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

  renderElevation(elevation) {
    if (!(elevation || elevation === 0)) { return ''; }
    return `${elevation.toFixed(2)}m`;
  }

  photoTableCell(jid, pid) {
    const path = `/jacket/${jid}/photo/${pid}`;
    const url = this.itemUrl(path);
    return (
      <td key={pid}>
        <img src={url} style={{ width: '100%' }} />
      </td>
    );
  }

  render() {
    const jid = this.props.match.params.jid;
    const {
      fullname,
      email,
      expedition,
      jacketnumber,
      created,
      formation,
      locality,
      lat,
      lng,
      elevation,
      specimentype,
      personnel,
      notes,
      tid,
    } = this.state.jacket;
    const userLink = (
      <a href={`mailto:${email}`}>{fullname}</a>
    );
    const createdString = created ? new Date(created).toISOString() : '';
    const photos = this.state.pids.map((pid) => this.photoTableCell(jid, pid));
    return (
      <div className="table-responsive">
        <div><h3>{Strings.itemTitle} {jid}</h3></div>
        <table className="table">
          <tbody>
            <tr className="creator">
              <td>{Strings.creator}</td><td>{userLink}</td>
            </tr>
            <tr className="expedition">
              <td>{Strings.expedition}</td><td>{expedition}</td>
            </tr>
            <tr className="jacketId">
              <td>{Strings.jacketId}</td><td>{jacketnumber}</td>
            </tr>
            <tr className="created">
              <td>{Strings.created}</td><td>{createdString}</td>
            </tr>
            <tr className="formation">
              <td>{Strings.formation}</td><td>{formation}</td>
            </tr>
            <tr className="locality">
              <td>{Strings.locality}</td><td>{locality}</td>
            </tr>
            <tr className="latLng">
              <td>{Strings.latLng}</td><td>{this.renderLatLng(lat, lng)}</td>
            </tr>
            <tr className="elevation">
              <td>{Strings.elevation}</td><td>{this.renderElevation(elevation)}</td>
            </tr>
            <tr className="specimenType">
              <td>{Strings.specimenType}</td><td>{specimentype}</td>
            </tr>
            <tr className="personnel">
              <td>{Strings.personnel}</td><td>{personnel}</td>
            </tr>
            <tr className="notes">
              <td>{Strings.notes}</td><td>{notes}</td>
            </tr>
            <tr className="tid">
              <td>{Strings.tid}</td><td>{tid}</td>
            </tr>
          </tbody>
        </table>
        <table className="table">
          <tbody>
            <tr className="photos">
              {photos}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Item;
