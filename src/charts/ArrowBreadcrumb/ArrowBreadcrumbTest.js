import { ArrowBreadcrumb } from "./ArrowBreadcrumb";

const data = [
    {
        text: "Home",
        isActive: true,
        onClick: (e, item) => {
            console.log(item);
        }
    },
    {
        text: "Page 1",
        isActive: false,
        onClick: (e, item) => {
            console.log(item);
        }
    },
    {
        text: "Page 2",
        isActive: false,
        onClick: (e, item) => {
            console.log(item);
        }
    },
    {
        text: "Page 3",
        isActive: false,
        onClick: (e, item) => {
            console.log(item);
        }
    }
]

export const ArrowBreadcrumbTest = () => {
    return <ArrowBreadcrumb items={data} />
}