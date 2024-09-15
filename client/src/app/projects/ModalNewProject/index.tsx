import Modal from "@/components/Modal";
import { useCreateProjectMutation } from "@/state/api";
import React, { useState } from "react";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const INITIAL_NEW_PROJECT_STATE = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const [createProject, { isLoading, error }] = useCreateProjectMutation();
  const [newProject, setNewProject] = useState(INITIAL_NEW_PROJECT_STATE);

  const handleSubmit = async () => {
    if (!newProject.name || !newProject.startDate || !newProject.endDate)
      return;

    const formattedStartDate = formatISO(new Date(newProject.startDate), {
      representation: "complete",
    });
    const formattedEndDate = formatISO(new Date(newProject.endDate), {
      representation: "complete",
    });

    newProject.startDate = formattedStartDate;
    newProject.endDate = formattedEndDate;

    await createProject(newProject);
  };

  const isFormValid = () => {
    return newProject.name && newProject.startDate && newProject.endDate;
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Project Name"
          value={newProject.name}
          onChange={(e) =>
            setNewProject({ ...newProject, name: e.target.value })
          }
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={newProject.startDate}
            onChange={(e) =>
              setNewProject({ ...newProject, startDate: e.target.value })
            }
          />
          <input
            type="date"
            className={inputStyles}
            value={newProject.endDate}
            onChange={(e) =>
              setNewProject({ ...newProject, endDate: e.target.value })
            }
          />
          <button
            type="submit"
            className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalNewProject;
