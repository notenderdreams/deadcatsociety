"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface EditFormData {
  title: string;
  description: string;
  topics: string[];
  notes: string;
  references: string[];
  contributors: string[];
}

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditFormData) => void;
  isEdit: boolean;
  initialData?: EditFormData;
}

const defaultFormData: EditFormData = {
  title: "",
  description: "",
  topics: [],
  notes: "",
  references: [],
  contributors: [],
};

export default function ClassModal({
  isOpen,
  onClose,
  onSave,
  isEdit,
  initialData,
}: ClassModalProps) {
  const [editFormData, setEditFormData] =
    useState<EditFormData>(defaultFormData);

  useEffect(() => {
    if (isOpen) {
      setEditFormData(initialData || defaultFormData);
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    const cleanedData = {
      title: editFormData.title,
      description: editFormData.description,
      topics: editFormData.topics.filter((topic) => topic.trim()),
      notes: editFormData.notes.trim(),
      references: editFormData.references.filter((ref) => ref.trim()),
      contributors: editFormData.contributors.filter((contrib) =>
        contrib.trim()
      ),
    };

    onSave(cleanedData);
    onClose();
  };

  const handleArrayFieldChange = (
    field: "topics" | "references" | "contributors",
    index: number,
    value: string
  ) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddArrayItem = (
    field: "topics" | "references" | "contributors"
  ) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleRemoveArrayItem = (
    field: "topics" | "references" | "contributors",
    index: number
  ) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-neutral-500/10 backdrop-blur-xl shadow-md",
        header: "border border-neutral-200",
        body: "py-6 border-l border-r border-neutral-200",
        footer: "border border-neutral-200",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-xl font-semibold">
          {isEdit ? "Edit Class" : "Add New Class"}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Class Title
              </label>
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter class title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                placeholder="Enter class description"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Notes (URL or Name::URL format)
              </label>
              <input
                type="text"
                value={editFormData.notes}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="https://example.com/notes.pdf or Notes Title::https://example.com/notes.pdf"
                className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Topics */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Topics
                </label>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("topics")}
                  className="inline-flex items-center gap-1 text-sm text-black hover:bg-neutral-100 px-2 py-1 rounded"
                >
                  <Plus size={14} />
                  Add Topic
                </button>
              </div>
              <div className="space-y-2">
                {editFormData.topics.map((topic, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) =>
                        handleArrayFieldChange("topics", index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Topic name"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem("topics", index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {editFormData.topics.length === 0 && (
                  <p className="text-sm text-neutral-500 italic">
                    No topics added yet.
                  </p>
                )}
              </div>
            </div>

            {/* Contributors */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Contributors
                </label>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("contributors")}
                  className="inline-flex items-center gap-1 text-sm text-black hover:bg-neutral-100 px-2 py-1 rounded"
                >
                  <Plus size={14} />
                  Add Contributor
                </button>
              </div>
              <div className="space-y-2">
                {editFormData.contributors.map((contributor, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={contributor}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          "contributors",
                          index,
                          e.target.value
                        )
                      }
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Contributor name"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveArrayItem("contributors", index)
                      }
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {editFormData.contributors.length === 0 && (
                  <p className="text-sm text-neutral-500 italic">
                    No contributors added yet.
                  </p>
                )}
              </div>
            </div>

            {/* References */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-700">
                  References
                </label>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("references")}
                  className="inline-flex items-center gap-1 text-sm text-black hover:bg-neutral-100 px-2 py-1 rounded"
                >
                  <Plus size={14} />
                  Add Reference
                </button>
              </div>
              <div className="space-y-2">
                {editFormData.references.map((reference, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          "references",
                          index,
                          e.target.value
                        )
                      }
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Reference (URL or text)"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem("references", index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {editFormData.references.length === 0 && (
                  <p className="text-sm text-neutral-500 italic">
                    No references added yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onClick={onClose}
            className="text-neutral-600 hover:bg-neutral-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-black text-white hover:bg-neutral-800 ml-2"
          >
            {isEdit ? "Save Changes" : "Create Class"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
