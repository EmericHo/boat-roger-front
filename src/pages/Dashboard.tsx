import React, { FunctionComponent, useState, useCallback, useEffect, FormEvent } from 'react';
import { BoatRequest, BoatResponse } from '../models/boat.models';
import { useNavigate } from 'react-router-dom';
import authenticationServices from '../services/authentication.services';
import boatService from '../services/boat.services';
import { ReactComponent as IconAdd } from '../assets/add.svg';
import { ReactComponent as IconDelete } from '../assets/delete.svg';
import { ReactComponent as IconEdit } from '../assets/edit.svg';
import { ReactComponent as IconInfo } from '../assets/info.svg';
import { ReactComponent as IconClose } from '../assets/close.svg';

import "./Dashboard.scss"

const DashboardPage: FunctionComponent = function () {
    const [boats, setBoats] = useState<BoatResponse[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isOpenDetails, setIsOpenDetails] = useState(false);
    const [boatId, setBoatId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [year, setYear] = useState('');
    const [boatDetails, setBoatDetails] = useState<BoatResponse>({});

    const navigate = useNavigate();

    const handleChange = useCallback((setter: (value: string) => void) => (e: FormEvent<HTMLInputElement>) => {
        setter(e.currentTarget.value);
    }, []);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function closeDetails() {
        setIsOpenDetails(false);
    }

    function closeUpdate() {
        setIsOpenUpdate(false);
    }

    const getBoats = useCallback(async () => {
        const boats = await boatService.getBoats();
        setBoats(boats);
    }, [setBoats]);

    const getDetails = useCallback(async (boat: BoatResponse) => {
        setBoatDetails(boat);
        setIsOpenDetails(true);
    }, [setBoatDetails, setIsOpenDetails]);

    const openUpdateBoat = useCallback(async (boat: BoatResponse) => {
        if (boat.name) setName(boat.name)
        if (boat.description) setDescription(boat.description)
        if (boat.manufacturer) setManufacturer(boat.manufacturer)
        if (boat.year) setYear(boat.year.toString())
        setBoatId(boat.id!);
        setIsOpenUpdate(true);
    }, [setBoatId, setName, setDescription, setManufacturer, setYear, setIsOpenUpdate]);

    const updateBoat = useCallback(async (e: FormEvent) => {
        const request: BoatRequest = {
            name: name,
            description: description,
            manufacturer: manufacturer,
            year: +year
        }

        await boatService.updateBoat(boatId, request);
        navigate(0);
    }, [navigate, boatId, name, description, manufacturer, year]);

    const deleteBoat = useCallback(async (boatId?: string) => {
        await boatService.deleteBoat(boatId!);
        navigate(0);
    }, [navigate]);

    const createBoat = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        await boatService.createBoat({
            "name": name,
            "description": description,
            "manufacturer": manufacturer,
            "year": +year
        });
        navigate(0);
    }, [navigate, name, description, manufacturer, year]);

    useEffect(() => {
        if (!authenticationServices.isAuthenticated()) {
            navigate("/login")
        }
        getBoats();
    }, [navigate, getBoats]);

    return (
        <>
            <div className="dashboard">
                <h4>Dashboard</h4>
                <div className="list">
                    {boats.map((boat) => (
                        <div key={boat.id}>
                            <div>{boat.name}</div>
                            <div><button className="option" onClick={() => getDetails(boat)}><IconInfo /></button>
                                <button className="option" onClick={() => openUpdateBoat(boat)}><IconEdit /></button>
                                <button className="option" onClick={() => deleteBoat(boat.id)}><IconDelete /></button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="add-floating" onClick={openModal}>
                    <IconAdd />
                </button>
            </div>

            <div>
                {isOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>
                                <IconClose />
                            </span>
                            <h1>Création du bateau</h1>
                            <form onSubmit={createBoat}>
                                <input name="name" type="text" placeholder="Nom du bateau" value={name} onChange={handleChange(setName)} autoComplete="off" />
                                <input name="description" type="text" placeholder="Description" value={description} onChange={handleChange(setDescription)} />
                                <input name="manufacturer" type="text" placeholder="Fabricant" value={manufacturer} onChange={handleChange(setManufacturer)} />
                                <input name="year" type="number" placeholder="Année" value={year} onChange={handleChange(setYear)} />

                                <button type="submit">Créer</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <div>
                {isOpenUpdate && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeUpdate}>
                                <IconClose />
                            </span>
                            <h1>Mise à jour du bateau</h1>
                            <form onSubmit={updateBoat}>
                                <input name="name" type="text" placeholder="Nom du bateau" value={name} onChange={handleChange(setName)} autoComplete="off" />
                                <input name="description" type="text" placeholder="Description" value={description} onChange={handleChange(setDescription)} />
                                <input name="manufacturer" type="text" placeholder="Fabricant" value={manufacturer} onChange={handleChange(setManufacturer)} />
                                <input name="year" type="number" placeholder="Année" value={year} onChange={handleChange(setYear)} />

                                <button type="submit">Modifier</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <div>
                {isOpenDetails && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeDetails}>
                                <IconClose />
                            </span>
                            <h1>Détails du bateau</h1>
                            <div className="details">
                                <div>Id: {boatDetails.id}</div>
                                <div>Nom :{boatDetails.name}</div>
                                <div>Description :{boatDetails.description}</div>
                                <div>Fabricant :{boatDetails.manufacturer}</div>
                                <div>Année :{boatDetails.year}</div>
                                <div>Créé le :{boatDetails.createdAt}</div>
                                <div>Mis à jour le :{boatDetails.updatedAt}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default DashboardPage;