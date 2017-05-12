
export declare class RamlJsonEnhancer {
  /**
   * Enchances RAML's JSON parser output by normalizing data type structure and
   * by expanding types definition useing the datatype_expansion library.
   */
  enhance(json: any): Promise<any>;
  /**
   * Enchances RAML's JSON parser output by normalizing data type structure and
   * by expanding types definition useing the datatype_expansion library.
   * The result of the operation will be saved to a file and returned by the Promise.
   */
  enhanceToFile(json: any, file: string): Promise<any>;
}



export declare class RamlJsonGenerator {
  /**
   * Constructs the builder.
   *
   * @param raml Target RAML file to generate the JSON from.
   * @param opts Options passed from the command line.
   */
  constructor(raml: string, options?: RamlJsonGenerator.GeneratorConfig);
  /**
   * Runs the command for current configuration.
   */
  generate(): Promise<any>;
}

declare namespace RamlJsonGenerator {
  export interface GeneratorConfig {
    /**
     * A JSON file name and path.
     * If set it will create a file with JSON data instead of returning the data.
     *
     * Defaults to `undefined`.
     */
    output?: string;
    /**
     * If true, then the output JSON will be formatted.
     *
     * Defaults to `false`.
     */
    prettyPrint?: boolean;
    /**
     * Print output messages.
     */
    verbose?: boolean;
  }
}
