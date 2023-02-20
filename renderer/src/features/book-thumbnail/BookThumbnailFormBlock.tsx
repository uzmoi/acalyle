import { css, cx } from "@linaria/core";
import { useCallback, useId } from "react";
import { vars } from "~/entities/theme";
import { FileInput, TextInput } from "~/shared/control";
import {
    ControlPartOutlineStyle,
    ControlPartResetStyle,
} from "~/shared/control/base";
import { Cropper, changeScale } from "~/shared/cropper";

export type BookThumbnailState = {
    file: File | null;
    x: number;
    y: number;
    scale: number;
    bgColor: string;
};

export const BookThumbnailFormBlock: React.FC<{
    cropState: BookThumbnailState;
    setCropState: React.Dispatch<React.SetStateAction<BookThumbnailState>>;
    fallbackThumbnail?: string;
    children?: React.ReactNode;
}> = ({ cropState, setCropState, fallbackThumbnail, children }) => {
    const handleFileChange = useCallback(
        (newFile: File | null) => {
            if (newFile != null) {
                setCropState(cropState => ({ ...cropState, file: newFile }));
            }
        },
        [setCropState],
    );

    const id = useId();

    return (
        <div className={FormBlockStyle}>
            <div className={InfoStyle}>
                <div>
                    <label
                        className={cx(
                            ControlPartResetStyle,
                            ControlPartOutlineStyle,
                            LabelStyle,
                        )}
                    >
                        Select a image
                        <FileInput
                            onFileChange={handleFileChange}
                            accept="image/*"
                            className={HiddenStyle}
                        />
                    </label>
                    <p
                        className={css`
                            font-size: 0.8em;
                        `}
                    >
                        {cropState.file?.name}
                    </p>
                </div>
                <dl>
                    <dd>
                        <label
                            htmlFor={`${id}-bg-color`}
                            className={LabelStyle}
                        >
                            background color
                        </label>
                    </dd>
                    <dt>
                        <TextInput
                            id={`${id}-bg-color`}
                            value={cropState.bgColor}
                            onValueChange={bgColor =>
                                setCropState(cropState => ({
                                    ...cropState,
                                    bgColor,
                                }))
                            }
                            aria-invalid={
                                !CSS.supports("color", cropState.bgColor)
                            }
                        />
                    </dt>
                </dl>
                <div>
                    <p>{Math.floor(cropState.scale * 100)}%</p>
                    <input
                        type="range"
                        min={10}
                        max={1000}
                        value={cropState.scale * 100}
                        onChange={e => {
                            const newScale =
                                e.currentTarget.valueAsNumber / 100;
                            setCropState(cropState => ({
                                ...cropState,
                                ...changeScale(
                                    cropState,
                                    { x: 0, y: 0 },
                                    newScale,
                                ),
                            }));
                        }}
                    />
                </div>
                <div>{children}</div>
            </div>
            <Cropper
                src={
                    cropState.file
                        ? URL.createObjectURL(cropState.file)
                        : fallbackThumbnail
                }
                state={cropState}
                onChange={cropState =>
                    setCropState(({ file, bgColor }) => ({
                        ...cropState,
                        file,
                        bgColor,
                    }))
                }
                disabled={cropState.file == null}
                className={CropperStyle}
                bgColor={cropState.bgColor}
            />
        </div>
    );
};

const FormBlockStyle = css`
    display: flex;
`;

const InfoStyle = css`
    position: relative;
    flex: 1 1;
    margin-right: 1em;
`;

const LabelStyle = css`
    font-size: 0.875em;
    font-weight: bold;
`;

const HiddenStyle = css`
    width: 1px;
    height: 1px;
    visibility: hidden;
`;

const CropperStyle = css`
    flex: 0 0 12em;
    width: 12em;
    height: 12em;
    border: 1px solid ${vars.color.text};
`;
