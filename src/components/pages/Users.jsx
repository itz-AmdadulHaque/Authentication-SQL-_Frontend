import React, { useEffect, useState } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdOutlineIndeterminateCheckBox } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { formatDate } from "../../utils/formatDate";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";
const Users = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState();
  const [errMsg, setErrMsg] = useState({ success: false, message: "" });

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const { data } = await axiosPrivate.get("/users/allUser");
        // console.log("All users: ", data);
        setUsers(data?.data);

        setErrMsg({ success: data?.success, message: data?.message });
      } catch (error) {
        handleRequestError(error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const handleRequestError = (error) => {
    console.log(error);
    if (!error?.response) {
      setErrMsg({ message: "No Server Response or Network error" });
    } else if (error.response.status === 403 || error.response.status === 401) {
      setAuth({});
      navigate("/login", { replace: true });
    } else {
      setErrMsg({ message: error?.response?.data?.message });
    }
  };

  const handleSelect = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers((prev) => prev.filter((prevId) => prevId !== id));
    } else {
      setSelectedUsers((prev) => [...prev, id]);
    }
  };

  const handleDelete = async () => {
    if (selectedUsers.length === 0) {
      setErrMsg({ message: "No selected users" });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axiosPrivate.delete("/users/deleteAccount", {
        data: {
          userIds: selectedUsers,
        },
      });

      // console.log("delete users ", data);
      setUsers((prev) =>
        prev.filter((user) => {
          return !selectedUsers.includes(user?.id);
        })
      );

      setSelectedUsers([]);
      setErrMsg({ success: data?.success, message: data?.message });
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (block) => {
    if (selectedUsers.length === 0) {
      setErrMsg({ message: "No selected users" });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axiosPrivate.put("/users/blockAccount", {
        userIds: selectedUsers,
        block,
      });

      // console.log("block users ", data);
      setUsers((prev) =>
        prev.map((user) => {
          return selectedUsers.includes(user?.id) ? { ...user, block } : user;
        })
      );

      setSelectedUsers([]);
      setErrMsg({ success: data?.success, message: data?.message });
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 pt-16 h-screen w-[90%] md:w-[75%] mx-auto flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          className="px-2 py-1 flex items-center gap-1 border-2 border-gray-400 font-semibold hover:border-black"
          onClick={() => handleBlockToggle(true)}
          disabled={loading}
        >
          <FaLock />
          Block
        </button>
        <button
          className="px-2 py-1 border-2 border-gray-400 font-semibold hover:border-black"
          onClick={() => handleBlockToggle(false)}
          disabled={loading}
        >
          <FaLockOpen />
        </button>
        <button
          className="px-2 py-1 text-white transition bg-red-500 border-2 border-gray-400 font-semibold hover:border-black"
          onClick={handleDelete}
          disabled={loading}
        >
          <RiDeleteBin5Fill />
        </button>
        {errMsg.message && (
          <p
            className={`font-semibold my-auto ${
              errMsg.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {errMsg?.message}
          </p>
        )}
      </div>

      <div className="min-h-0 flex-grow overflow-auto relative">
        {loading && (
          <div className="h-full w-full fixed top-0 left-0 z-10 backdrop-blur-[1px]">
            {" "}
            <Spinner />{" "}
          </div>
        )}
        <table className="border border-black w-full">
          <thead className="bg-gray-400 sticky top-0 z-10">
            <tr>
              <th className="border py-2 px-2 border-black w-[40px]">
                <MdOutlineIndeterminateCheckBox />
              </th>
              <th className="border border-black">Name</th>
              <th className="border border-black">Email</th>
              <th className="border border-black min-w-[110px]">Last login</th>
              <th className="border border-black w-[80px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                className={`text-center hover:bg-blue-200 ${
                  user.block ? "bg-red-300" : ""
                }`}
                key={user?.id}
                onClick={() => handleSelect(user?.id)}
              >
                <td className="border border-black p-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user?.id)}
                    readOnly
                  />
                </td>
                <td className="border border-black p-1">{user?.name}</td>
                <td className="border border-black p-1">{user?.email}</td>
                <td className="border border-black p-1">
                  {formatDate(user?.updatedAt)}
                </td>
                <td className="border border-black p-1">
                  {user?.block ? "Blocked" : "Active"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
