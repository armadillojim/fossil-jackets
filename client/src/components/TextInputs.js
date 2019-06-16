import React, { Component } from 'react';

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

export { PlainTextInput };

const styles = {
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
};
