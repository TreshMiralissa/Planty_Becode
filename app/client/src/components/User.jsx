import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineModeEditOutline } from "react-icons/md"
import { useEffect, useState, useRef } from "react";

import { EditUser } from "./editUser";

import axios from "../api/axios";
const PLAYER_URL = "/api/account/username/";
const SIGNOUT_URL = "/api/user/signout";

export function User() {
    const { auth, setAuth } = useAuth();
    console.log(auth)
    const { player, setPlayer } = useAuth();
    // const errRef = useRef();

    // const [errMsg, setErrMsg] = useState(false);
    const [edit, setEdit] = useState(false);
    const [dataPlayer, setDataPlayer] = useState({});

    const navigate = useNavigate();
    const to = "/";

    useEffect(() => {
        let isMounted = true; // mounted true = the component is loaded to the site
        const controller = new AbortController();

        const getPlayer = async () => {
            try {
                const { data: response } = await axios.get(PLAYER_URL + auth);
                isMounted && setPlayer(response);
                setDataPlayer(response);

            } catch (err) {
                console.log(err);
            }
        }
        getPlayer();

        return () => { // we clean up function of the useEffect
            isMounted = false; // means we don't mount the component and 
            controller.abort();
        }
    }, [])

    console.log("player : ");
    console.log(player);
    console.log("dataPlayer : ");
    console.log(dataPlayer);

    const handleLogout = async () => {
        try {
            const response = await axios.get(SIGNOUT_URL);
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }

        setAuth(null);
        localStorage.clear();

        console.log("you are logged out");

        navigate(to, { replace: true });
    };

    const handleDelete = async () => {

        try {
            await axios.delete(PLAYER_URL + auth);
            navigate(to, { replace: true });

        } catch (err) {
            console.log(err)
            console.log("something went wrong");
        }
    }

    return (
        <section className="ml-8 mr-8">
            <div className="player__header flex justify-between mb-10">
                <h2 className="player__header--title text-3xl w-1/2 flex flex-col">Welcome, <span className="self-end leading-6">{player.username}!</span>
                </h2>
                <div className="flex items-end gap-4">
                    <div className="bg-Magnolia player__header--score flex gap-1 p-1 rounded-md text-xs items-center">
                        <img src="../src/images/icon-leaf.png" alt="Leaf score icon" className="rotate-90 h-[20px]" />
                        <p className="border-l border-solid border-SmokyBlack pl-2 pr-2">{player.leafs}</p>
                    </div>
                    <a className="bg-Red/80 w-min rounded-full p-1 player__header--signout flex h-min" onClick={handleLogout}>
                        <AiOutlineLogout className="text-white" />
                    </a>
                </div>
            </div>
            <div className="player__tree">
                {/* add loop to display 5 tree cards */}
                <div className="player__tree--card bg-Magnolia p-2 w-24 flex flex-col items-center rounded-md">
                    <p>Tree Title</p>
                    <img src="../src/images/icon-tree.png" alt="Tree Picture" className="w-[50px]" />
                </div>
            </div>
            <div className="form__container palyer__data text-sm mt-10 mb-28">
                <div className="palyer__info--header flex items-center gap-2 text-lg">
                    <h4>Your data </h4>
                    <a onClick={() => { edit === false ? setEdit(true) : setEdit(false) }}>
                        <MdOutlineModeEditOutline />
                    </a>
                </div>
                <>
                    {edit === false ?
                        <div className="palyer__info--container flex gap-3 text-xs">
                            <div className="palyer__info--title flex flex-col gap-y-2">
                                <p>Username</p>
                                <p>Email</p>
                                <p>Description</p>
                            </div>
                            <div className="text-SmokyBlack/50 palyer__info--data flex flex-col gap-y-2">
                                <p>{player.username}</p>
                                <p>{player.email}</p>
                                <p>{player.bio}</p>

                            </div>
                        </div>
                        :
                        <EditUser dataPlayer={dataPlayer} setDataPlayer={setDataPlayer} setEdit={setEdit} />
                    }
                </>
                <a onClick={handleDelete} className="text-Red/80 mt-2">Delete Account</a>

            </div >
        </section >
    )
}

