import { css, cx } from "@linaria/core";
import { useId, useMemo, useState } from "react";
import { graphql, useLazyLoadQuery, useMutation } from "react-relay";
import { vars } from "~/entities/theme";
import { Button, FileInput, Form, TextInput } from "~/shared/control";
import {
    ControlPartOutlineStyle,
    ControlPartResetStyle,
} from "~/shared/control/base";
import { Cropper, changeScale, cropImage } from "~/shared/cropper";
import { bookThumbnailChangeMutation } from "./__generated__/bookThumbnailChangeMutation.graphql";
import { bookThumbnailQuery } from "./__generated__/bookThumbnailQuery.graphql";

export const BookThumbnailForm: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const { book } = useLazyLoadQuery<bookThumbnailQuery>(
        graphql`
            query bookThumbnailQuery($bookId: ID!) {
                book(id: $bookId) {
                    thumbnail
                }
            }
        `,
        { bookId },
    );

    const [file, setFile] = useState<File | null>(null);
    const fileUrl = useMemo(
        () => (file ? URL.createObjectURL(file) : book?.thumbnail),
        [file, book?.thumbnail],
    );

    // prettier-ignore
    const [commitChangeThumbnail, isInFlight] = useMutation<bookThumbnailChangeMutation>(graphql`
        mutation bookThumbnailChangeMutation($id: ID!, $thumbnail: Upload!) {
            updateBookThumbnail(id: $id, thumbnail: $thumbnail) {
                thumbnail
            }
        }
    `);

    const [bgColor, setBgColor] = useState<string>("#888888");
    const [cropState, setCropState] = useState({ x: 0, y: 0, scale: 1 });

    const handleSubmit = () => {
        if (fileUrl == null) return;
        void cropImage(
            fileUrl,
            { width: 512, height: 512 },
            cropState,
            bgColor,
        ).then(blob => {
            commitChangeThumbnail({
                variables: { id: bookId, thumbnail: null },
                uploadables: { "variables.thumbnail": blob },
            });
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <BookThumbnailFormBlock
                file={file}
                fileUrl={fileUrl}
                setFile={setFile}
                cropState={cropState}
                setCropState={setCropState}
                bgColor={bgColor}
                setBgColor={setBgColor}
            >
                <Button
                    type="submit"
                    className={SubmitButtonStyle}
                    disabled={file == null || isInFlight}
                >
                    Submit
                </Button>
            </BookThumbnailFormBlock>
        </Form>
    );
};

type CropState = {
    x: number;
    y: number;
    scale: number;
};

export const BookThumbnailFormBlock: React.FC<{
    file: File | null;
    fileUrl: string | undefined;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    bgColor: string;
    setBgColor: React.Dispatch<React.SetStateAction<string>>;
    cropState: CropState;
    setCropState: React.Dispatch<React.SetStateAction<CropState>>;
    children?: React.ReactNode;
}> = ({
    file,
    fileUrl,
    setFile,
    cropState,
    setCropState,
    bgColor,
    setBgColor,
    children,
}) => {
    const handleFileChange = (newFile: File | null) => {
        if (newFile != null) {
            setFile(newFile);
        }
    };

    const id = useId();

    return (
        <div className={FormBlockStyle}>
            <div className={InfoStyle}>
                <h3
                    className={css`
                        margin-bottom: 0.6em;
                    `}
                >
                    Thumbnail
                </h3>
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
                        {file?.name}
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
                            value={bgColor}
                            onValueChange={setBgColor}
                            aria-invalid={!CSS.supports("color", bgColor)}
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
                            setCropState(cropState =>
                                changeScale(
                                    cropState,
                                    { x: 0, y: 0 },
                                    newScale,
                                ),
                            );
                        }}
                    />
                </div>
                <div>{children}</div>
            </div>
            <Cropper
                src={fileUrl}
                state={cropState}
                onChange={setCropState}
                disabled={file == null}
                className={CropperStyle}
                bgColor={bgColor}
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

const SubmitButtonStyle = css`
    position: absolute;
    right: 0;
    bottom: 0;
`;

const CropperStyle = css`
    flex: 0 0 12em;
    width: 12em;
    height: 12em;
    border: 1px solid ${vars.color.text};
`;
