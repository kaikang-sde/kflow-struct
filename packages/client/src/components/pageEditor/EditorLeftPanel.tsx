import { WidgetsOutlined } from "@mui/icons-material";
import { Tabs, Tab, Tooltip } from "@mui/material";
import clsx from "clsx";
import ComponentsLibrary from "./leftPanel/ComponentsLibrary";

export default function EditorLeftPanel() {

    const items = [
        {
            key: "components-library",
            label: (
                <Tooltip title="Available Components" arrow>
                    <div className="flex items-center gap-1 text-sm text-gray-600 font-medium px-2">
                        <WidgetsOutlined fontSize="small" />
                        <span>Library</span>
                    </div>
                </Tooltip>
            ),
            component: <ComponentsLibrary />,
        },
    ];

    const activeTab = "components-library"; // fixed active tab

    return (
        <div className="w-full">
            <Tabs
                value={activeTab}
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

            {/* empty space */}
            <div className="mt-4" />

            {items.find((item) => item.key === activeTab)?.component}
        </div>
    );
}