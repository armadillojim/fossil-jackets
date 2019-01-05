import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';

class AutoCompleteTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem(suggestion) {
    return (
      <div style={styles.suggestion} key={suggestion}>
        {suggestion}
      </div>
    );
  }

  render() {
    const {
      label,
      keyboardType,
      maxLength,
      onChangeText,
      placeholder,
      suggestions,
    } = this.props;
    const { text } = this.state;
    return (
      <div style={styles.autoContainer}>
        <div style={styles.label}>{label}</div>
        <Autocomplete
          value={text}
          items={suggestions}
          getItemValue={(item) => item}
          renderItem={this.renderItem}
          inputProps={{
            autoCapitalize: 'none',
            maxLength: maxLength || 64,
            placeholder: placeholder || '',
            spellCheck: false,
            style: styles.input,
            type: keyboardType || 'text',
          }}
          onChange={(event, text) => { this.setState({ text: text }); onChangeText(text); }}
          onSelect={(text) => { this.setState({ text: text }); onChangeText(text); }}
          shouldItemRender={(suggestion, text) => suggestion.toLowerCase().startsWith(text.toLowerCase())}
        />
      </div>
    );
  }
}

class PlainTextInput extends Component {
  render() {
    const {
      label,
      keyboardType,
      maxLength,
      onChangeText,
      placeholder,
    } = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.label}>{label}</div>
        <input
          autoCapitalize={'none'}
          maxLength={maxLength || 64}
          onChange={(event) => { const text=event.target.value; onChangeText(text); }}
          placeholder={placeholder || ''}
          spellCheck={false}
          style={styles.input}
          type={keyboardType || 'text'}
        />
      </div>
    );
  }
}

export { AutoCompleteTextInput, PlainTextInput };

const styles = {
  autoContainer: {
    height:40,
    margin:5,
    width:'97%',
  },
  container: {
    margin: 5,
    width: '97%',
  },
  label: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  input: {
    borderColor: 'grey',
    borderRadius: 3,
    borderWidth: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  suggestion: {
    fontSize: 16,
  },
};
