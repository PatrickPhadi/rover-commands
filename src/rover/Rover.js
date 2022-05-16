export default class Rover {
    constructor() {
        this.zone = [5, 5],
            this.surroundingRovers = [],
            this.command = {
                location: {
                    x: 0,
                    y: 0
                },
                direction: 'S'
            }
    }

    /**
     * Send Commands to rover
     * @param {Object} body { zone: '8 8', commands: [{ position: '1 2 N', movements: 'MMRMMRMRRM' }] }
     * @returns console.log
     */
    sendCommands = async body => {
        try {
            //Verify zone value provided
            const zoneResponse = this.validateZone(body.zone)

            if (zoneResponse !== "") {
                return console.log('Zone error : ', zoneResponse);
            }

            //Set zone size 
            let zoneInput = body.zone.split(" ")
            this.zone[0] = zoneInput[0]
            this.zone[1] = zoneInput[1]

            //Verify command provided
            const commandResponse = this.validateCommands(body.commands)
            if (commandResponse !== "") {
                return console.log('Command error: ', commandResponse);
            }

            let output = []
            body.commands.forEach((rover) => {
                this.moveRover(rover)
                output.push(this.landOutput(this.command));
            });

            return console.log('Successfully sent commands. Rover would Land up at: ', output)

        } catch (error) {
            return console.log('failed to send commands : ', error);
        }

    }

    /**
     * Validate Zone Size
     * @param {String} zone 
     * @returns {String}
     */
    validateZone = zone => {
        let result = ''
        if (typeof zone !== "undefined" && zone !== "") {
            let values = zone.split(" ")
            if (typeof values !== "undefined" && values.length !== 2) {
                result = 'Please provide 2 zone values, separated by a space character e.g 8 8 '
            }
            values.forEach(val => {
                if (!/^\d+$/.test(val)) {
                    result = 'One of the zone values entered is not a number'

                } else {

                    if (val <= 0) {
                        result = 'One of the values entered is less than or equal to zero'

                    }
                }

            });

            return result
        }
        result = 'Please provide zone size'
        return result
    }

    /**
     * Validate Commands
     * @param {Array} commands 
     * @returns {String}
     */
    validateCommands = commands => {
        let result = '';
        if (typeof commands === "undefined" && commands.length === 0) {
            return result = "Please provide one or more commands"
        }

        commands.forEach((command) => {
            // Validate command position
            let values = command.position.split(" ")
            if (typeof values !== "undefined" && values.length !== 3) {
                result = 'Please provide position in this format: 1 2 N';
            }

            // Check X co-ordinate if is a number
            if (!/^\d+$/.test(values[0])) {
                result = 'X co-ordinate value entered is not a number';
            }

            // Check Y co-ordinate if is a number
            if (!/^\d+$/.test(values[1])) {
                result = 'Y co-ordinate value entered is not a number';
            }

            // Validate X co-ordinate should not be greater than zone size
            if (values[0] > this.zone[0]) {
                result = 'X co-ordinate value cannot be greater than the zone size';
            }

            // Validate Y co-ordinate should not be greater than zone size
            if (values[1] > this.zone[1]) {
                result = 'Y co-ordinate value cannot be greater than the zone size';
            }

            // Validate cardinal point
            if (!/^[a-zA-Z]/i.test(values[2])) {
                result = 'Cardinal point entered must be a letter';

                //Check whether it's correct cardinal points
            } else if (!['n', 'e', 's', 'w'].includes(values[2].toLowerCase())) {
                result = 'Cardinal point entered is incorrect, please enter either N, E, S, W';
            }

            // Validate movement commands
            if (!/^[a-zA-Z]/i.test(command.movements)) {
                result = 'Movement entered is not a letter';
            } else if (['m', 'l', 'r'].includes(command.movements.toLowerCase())) {
                result = 'Movement entered is incorrect, please enter either M, L, R';
            }
        })

        return result
    }

    /**
     * Move the rover according the commands
     * @param {Object} command
     */
    moveRover = (command) => {
        let positionValues = command.position.split(" ");

        this.command.location.x = positionValues[0]
        this.command.location.y = positionValues[1]
        this.command.direction = positionValues[2]

        //Commands
        this.command.movements = command.movements

        for (let index = 0; index < this.command.movements.length; index++) {
            const movement = this.command.movements[index];

            this.commandMovement(movement)
        }

    }

    /**
     * Command the movement of rover
     * @param {String} movement 
     */
    commandMovement = (movement) => {
        movement = movement.toLowerCase()
        switch (movement) {
            case 'm':
                this.moveForward()
                break;
            case 'l':
                this.turnLeft()
                break;
            case 'r':
                this.turnRight()
                break;
            default:
                break;
        }
    }

    moveForward = () => {
        let direction = this.command.direction.toLowerCase()
        switch (direction) {
            case 'n':
                if (this.zone[1] > this.command.location.y) {
                    this.command.location.y++
                }
                break;
            case 's':
                if (this.command.location.y - 1 >= 0) {
                    this.command.location.y--
                }
                break;
            case 'e':
                if (this.zone[0] > this.command.location.x) {
                    this.command.location.x++
                }
                break;
            case 'w':
                if (this.command.location.x - 1 >= 0) {
                    this.command.location.x--
                }
                break;
            default:
                break;
        }
    }

    turnLeft = () => {
        let direction = this.command.direction.toLowerCase()
        switch (direction) {
            case 'n':
                this.command.direction = 'W'
                break;
            case 's':
                this.command.direction = 'E'
                break;
            case 'e':
                this.command.direction = 'N'
                break;
            case 'w':
                this.command.direction = 'S'
                break;

            default:
                break;
        }
    }

    turnRight = () => {
        let direction = this.command.direction.toLowerCase()
        switch (direction) {
            case 'n':
                this.command.direction = 'E'
                break;
            case 's':
                this.command.direction = 'W'
                break;
            case 'e':
                this.command.direction = 'S'
                break;
            case 'w':
                this.command.direction = 'N'
                break;

            default:
                break;
        }
    }

    landOutput = (command) => {

        let x = ''
        let y = ''
        let direction = ''

        x = command.location.x.toString()
        y = command.location.y.toString()
        direction = command.direction
        let output = x + " " + y + " " + direction

        return output;
    }
}