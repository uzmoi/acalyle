// @ts-check
import { writeFile, readdir } from "node:fs/promises";

/** @typedef {(string | Indent)[]} Indent */

/**
 * @param {Indent} lines
 * @returns {string[]}
 */
const indent = lines =>
    lines.flatMap(line =>
        Array.isArray(line)
            ? indent(line).map(line => `  ${line}`)
            : line.split("\n"),
    );

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
const components = async dir => {
    return (await readdir(dir)).flatMap(component => [
        `- component_id: ${component}`,
        `  paths: [ ${dir}/${component}/** ]`,
    ]);
};

/**
 * @param {Object} object
 * @returns {string}
 */
const yaml = object => {
    /**
     * @param {Object} object
     * @returns {Indent}
     */
    const yamlInternal = object => {
        if (Array.isArray(object)) {
            return object;
        }
        return Object.entries(object).flatMap(([key, value]) =>
            typeof value !== "object"
                ? `${key}: ${value}`
                : [`${key}:`, yamlInternal(value)],
        );
    };
    return indent(yamlInternal(object)).join("\n");
};

const contents = yaml({
    comment: {
        layout: `"header, diff, flags, components"`,
    },
    component_management: {
        individual_components: [
            ...(await components("apps")),
            ...(await components("packages")),
        ],
    },
});

// cspell:word codecov
await writeFile("./codecov.yml", contents);
