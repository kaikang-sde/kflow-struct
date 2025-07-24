// src/components/ComponentList.tsx

import {
    OndemandVideo,
    ViewCarousel,
    CreditCard,
    FormatListBulleted,
    Image as ImageIcon,
    Title,
    HorizontalRule,
    FormatColorText,
    QrCode,
    UnfoldMore,
    Warning,
    Edit,
    TextFields,
    RadioButtonChecked,
    CheckBox,
} from "@mui/icons-material";

import type { FC, ReactNode } from "react";

// Editor Component Props
interface ComponentProps {
    name: string;
    icon: ReactNode;
    type: string;
}

// Editor Component
const EditorComponent: FC<ComponentProps> = ({ icon, name }) => {
    return (
        <div className="border py-2 pl-2 w-full flex items-center gap-1 text-xs cursor-pointer select-none hover:border-blue-500">
            {icon}
            <span>{name}</span>
        </div>
    );
};

// Show Components
const components: ComponentProps[] = [
    { type: "video", name: "Video", icon: <OndemandVideo fontSize="small" /> },
    { type: "swiper", name: "Swiper", icon: <ViewCarousel fontSize="small" /> },
    { type: "card", name: "Card", icon: <CreditCard fontSize="small" /> },
    { type: "list", name: "List", icon: <FormatListBulleted fontSize="small" /> },
    { type: "image", name: "Image", icon: <ImageIcon fontSize="small" /> },
    { type: "titleText", name: "TitleText", icon: <Title fontSize="small" /> },
    { type: "split", name: "Split", icon: <HorizontalRule fontSize="small" /> },
    { type: "richText", name: "RichText", icon: <FormatColorText fontSize="small" /> },
    { type: "qrcode", name: "Qrcode", icon: <QrCode fontSize="small" /> },
    { type: "empty", name: "Empty", icon: <UnfoldMore fontSize="small" /> },
    { type: "alert", name: "Alert", icon: <Warning fontSize="small" /> },
];

// Form Components
const componentByUserInput: ComponentProps[] = [
    { type: "input", name: "Input", icon: <Edit fontSize="small" /> },
    { type: "textArea", name: "TextArea", icon: <TextFields fontSize="small" /> },
    { type: "radio", name: "Radio", icon: <RadioButtonChecked fontSize="small" /> },
    { type: "checkbox", name: "Checkbox", icon: <CheckBox fontSize="small" /> },
];


export default function ComponentsLibrary() {
    return (
        <div>
            <div className="grid grid-cols-2 items-center gap-2">
                {components.map((item, index) => (
                    <EditorComponent {...item} key={index} />
                ))}
            </div>

            <div className="my-4 h-px bg-gray-300" />

            <div className="grid grid-cols-2 items-center gap-2">
                {componentByUserInput.map((item, index) => (
                    <EditorComponent {...item} key={index} />
                ))}
            </div>
        </div>
    );
}