import { useState } from "react";
import { SettingsOutlined, TuneOutlined } from "@mui/icons-material";
import { Tabs, Tab, Tooltip } from "@mui/material";
import clsx from "clsx";

export default function EditorRightPanel() {
    const [activeTab, setActiveTab] = useState("components-fields");

    const handleChange = (_: any, newValue: string) => {
        setActiveTab(newValue);
    };

    const items = [
        {
            key: "components-fields",
            label: (
                <Tooltip title="Components Attributes" arrow>
                    <div className="flex items-center gap-1">
                        <TuneOutlined fontSize="small" />
                        <span className="text-sm">Components</span>
                    </div>
                </Tooltip>
            ),
        },
        {
            key: "global-settings",
            label: (
                <Tooltip title="Global Attributes" arrow>
                    <div className="flex items-center gap-1">
                        <SettingsOutlined fontSize="small" />
                        <span className="text-sm">Globals</span>
                    </div>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="w-full">
            <Tabs
                value={activeTab}
                onChange={handleChange}
                textColor="primary"
                indicatorColor="primary"
                className="border-b border-gray-300"
            >
                {items.map((item) => (
                    <Tab
                        key={item.key}
                        value={item.key}
                        label={item.label}
                        className={clsx(
                            "capitalize min-w-0 px-4 py-2",
                            activeTab === item.key ? "text-blue-600" : "text-gray-500"
                        )}
                    />
                ))}
            </Tabs>

            <div className="mt-4">
                {activeTab === "components-fields" && (
                    <div className="text-sm text-gray-800">Component List Content...</div>
                )}
                {activeTab === "global-settings" && (
                    <div className="text-sm text-gray-800">Global Settings...</div>
                )}
            </div>
        </div>
    );
}