/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const Table = require('cli-table');

//////////////////////////////////
//////////////////////////////////
// Public API
//////////////////////////////////
//////////////////////////////////

module.exports = (yargs, helper) => yargs.command(
    'query',
    'Query the state of Poppy motors.',
    (yargs) => {
        let optionHelper = helper.optionHelper;

        optionHelper.addOptions(
            yargs,
            'Query Options:',
            ['motor', 'register', 'invert']
        );
        optionHelper.addPoppyConfigurationOptions(yargs);

        yargs
            .example(
                `$0 query -r compliant`,
                'Get the \`compliant\` register value of all motors'
            )
            .example(
                `$0 query -m m1 m6 -r present_position upper_limit`,
                'Get the \`present_position\` and \'upper_limit\' register values of motors m1 and m6'
            )
        ;
    },
    (argv) => query(argv, helper.poppy) // Main job
);

//////////////////////////////////
//////////////////////////////////
// Private
//////////////////////////////////
//////////////////////////////////

//////////////////////////////////
// The query command itself
//////////////////////////////////

const query = async (argv, poppy) => {

    let motors = argv.motor.includes('all') ?
        poppy.getAllMotorIds():
        argv.motor
    ;

    let registers = argv.register;

    //
    // Get data...
    //

    let result = await _query(poppy, motors, registers);

    //
    // ...And display them, if any
    //
    if ( result ) {

        let display = argv['I'] ?
            {
                rows: motors, 
                cols: registers,
                cb: (row) => {
                    let o = {};
                    o[row] = Object
                        .values(
                            result.find( obj => row === obj.motor )
                        )
                        .slice(1) // motor attribute
                        .map(v => _format(v)) // other attributes are register values
                    ;
                    return o;
                }
            }:
            {
                rows: registers, 
                cols: motors,
                cb: (row) => {
                    let o = {};
                    o[row] = result.map( res => _format(res[row]) );
                    return o;
                }
            }
        ;

        let table = new Table({
            head: [].concat('', ...display.cols)
        });

        for (let row of display.rows) {
            table.push(
                display.cb.call(null,row)
            )
        }

        // At last, let's display the result
        
        console.log(
            table.toString()
        );
    }
    
  }

const _query = async (poppy, motors, registers) => {

    let res = [];

    await Promise.all( motors.map( async motor => {
    //for(let motor of motors) {        
        let data = (await Promise.all(
            registers.map( async register => 
                (await poppy[motor].get(register))
            )
        ))
        .reduce( (acc, obj) =>
            Object.assign(acc, obj),
            {motor}
        );
        res.push(data);
    }))
    .catch( err => {
        console.log(`Err: Unable to perform querying. Check connection settings:`);
        console.log(`   Request URL: ${err.config.url}`);
        res = null;
    });

    return res;
  }


//////////////////////////////////
// misc.
//////////////////////////////////

let _format = value => ( !isNaN(parseFloat(value)) ^ !Number.isInteger(value) ) ?
    value: // String, Boolean, Integer
    Number(value).toFixed(1) // Float: 1 significant digit is enough
;
