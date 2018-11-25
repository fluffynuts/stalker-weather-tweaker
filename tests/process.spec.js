require("./matchers");
const
  faker = require("faker"),
  process = require("../src/tweak/process");

describe(`process`, () => {
  it(`should export the process function`, () => {
    // Arrange
    // Act
    expect(process).toBeFunction();
    // Assert
  });

  describe(`behavior`, () => {
    it(`should apply one modifier to one line`, async () => {
      // Arrange
      const
        variable = faker.random.alphaNumeric(4),
        lines = [
          `;Anomaly Weather`,
          `;by meatchunk`,
          `;Night cloudy rain full moon obscured by clouds.`,
          ``,
          `#include("af3_day_rain.ltx")`,
          ``,
          `[00:00:00]`,
          `  sun                             = moon_full_clear`,
          `  sky_texture                   	= sky\\skygod\\rain\\00-00`,
          `  sky_rotation                    = 0`,
          `  ${variable}                       = 0.02, 0.02, 0.02`,
        ],
        args = [{
          name: variable,
          modifiers: [{
            op: "+", value: 0.1
          }, {
            op: "~",
          }, {
            op: "-", value: 0.01
          }]
        }],
        expected = [
          `;Anomaly Weather`,
          `;by meatchunk`,
          `;Night cloudy rain full moon obscured by clouds.`,
          ``,
          `#include("af3_day_rain.ltx")`,
          ``,
          `[00:00:00]`,
          `  sun                             = moon_full_clear`,
          `  sky_texture                   	= sky\\skygod\\rain\\00-00`,
          `  sky_rotation                    = 0`,
          `  ${variable}                       = 0.12, 0.02, 0.01`,
        ];
      // Act
      const result = process(lines, args);
      // Assert
      expect(result).toEqual(expected);
    });


    it(`should apply two modifiers`, async () => {
      // Arrange
      const
        variable1 = "variable1",
        variable2 = "variable2",
        lines = [
          `;Anomaly Weather`,
          `;by meatchunk`,
          `;Night cloudy rain full moon obscured by clouds.`,
          ``,
          `#include("af3_day_rain.ltx")`,
          ``,
          `[00:00:00]`,
          `sun                             = moon_full_clear`,
          `${variable2}    = 0.9, 0.2, 0.3, 0.4`,
          `sky_texture                   	= sky\\skygod\\rain\\00-00`,
          `sky_rotation                    = 0`,
          `${variable1}                       = 0.02, 0.02, 0.02`,
        ],
        args = [{
          name: variable1,
          modifiers: [
            {op: "+", value: 0.1},
            {op: "~",},
            {op: "-", value: 0.01}
          ]
        }, {
          name: variable2,
          modifiers: [
            {op: "-", value: 0.3},
            {op: "+", value: 1},
            {op: "~"}
          ]
        }],
        expected = [
          `;Anomaly Weather`,
          `;by meatchunk`,
          `;Night cloudy rain full moon obscured by clouds.`,
          ``,
          `#include("af3_day_rain.ltx")`,
          ``,
          `[00:00:00]`,
          `sun                             = moon_full_clear`,
          `${variable2}    = 0.6, 1.2, 0.3, 0.4`,
          `sky_texture                   	= sky\\skygod\\rain\\00-00`,
          `sky_rotation                    = 0`,
          `${variable1}                       = 0.12, 0.02, 0.01`,
        ];
      // Act
      const result = process(lines, args);
      // Assert
      expect(result).toEqual(expected);
    });
  });
})
;
