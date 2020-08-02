import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import "./styles.css";

/**
 * 
 * Functional component ModalComponent, renders modal and it's dynamic body content 
 */
const ModalComponent = (props) => {
    return (
        <Modal show={props.show} onHide={props.onCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onCloseModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalComponent;