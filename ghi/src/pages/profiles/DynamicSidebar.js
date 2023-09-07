import React, {useState, useEffect} from 'react'
import { Link } from "react-router-dom";
import Modal from  "react-modal";
import './css/dynamicSidebar.css'

function DynamicSidebar({ token, authenticatedUser }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [affiliations, setAffiliations] = useState([]);
    const [newAffiliation, setNewAffiliation] = useState("");



      const handleCancelClick = () => {
        setShowAddForm(false);
        setNewAffiliation("");
      };

      const handleAddAffiliation = () => {
        setAffiliations([...affiliations, newAffiliation]);
        setNewAffiliation("");
        setShowAddForm(false);
      };

    const openModal = () => {
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
    };

    const handleAffiliationAdded = (affiliation) => {
      setAffiliations([...affiliations, affiliation]);
    };


    const handleAddClick = () => {
        setShowAddForm(true);
      };
  return(

    <>
   <div>
        <button className="dynamic-add-button" onClick={handleAddClick}>Add Affiliation</button>
      </div>

      <Modal
        isOpen={showAddForm}
        onRequestClose={handleCancelClick}
        contentLabel="Add Affiliation Modal"
      >
        <h2>Add Affiliation</h2>
        <input
          type="text"
          placeholder="Enter new affiliation"
          value={newAffiliation}
          onChange={(e) => setNewAffiliation(e.target.value)}
        />
        <button onClick={handleAddAffiliation}>Save</button>
        <button onClick={handleCancelClick}>Cancel</button>
      </Modal>

      <div>
        {/* <h3>Affiliations</h3> */}
        <ul>
          {affiliations.map((affiliation, index) => (
            <li key={index}>{affiliation}</li>
          ))}
        </ul>
      </div>



      </>
  )
}

export default DynamicSidebar;
