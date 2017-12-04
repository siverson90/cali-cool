import React from "react";

const AlbumsSelect = props => {
  return (

    <select 
      onChange={() => props.handleInputChange()}
      name="albumselectcomp"
      id="albumselectcomp"
      className="form-control">
      <option value="default">Select</option>
      {props.albums.map( (albums , i) => (
        <option value="{albums.id}" key={i}>{albums.title}</option>
      ))}
    </select>

)};

export default AlbumsSelect;
