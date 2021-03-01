import React from 'react';

interface Props {
    visibility: boolean
}

const Loading: React.FC<Props> = ({ visibility }) => {

    const [dot, setDot] = React.useState<number>(0);

    React.useEffect(() => {
        if (visibility) {
            setTimeout(() => {
                if (dot === 0) {
                    setDot(1);
                }
                else if (dot === 1) {
                    setDot(2)
                }
                else if (dot === 2) {
                    setDot(0);
                }
            }, 300);
        }
    }, [visibility, dot])

    return (
        <div className="lds-ellipsis">
            <div style={{ opacity: dot === 0 ? 0.5 : 1 }}></div>
            <div style={{ opacity: dot === 1 ? 0.5 : 1 }}></div>
            <div style={{ opacity: dot === 2 ? 0.5 : 1 }}></div>
        </div>
    )

}

export default React.memo(Loading);
