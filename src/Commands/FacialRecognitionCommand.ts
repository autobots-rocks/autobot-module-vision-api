import { Command, CommandBase, CommandParser, Event } from '@autobot/common';
import { RichEmbed }                                  from "discord.js";

const vision = require('@google-cloud/vision');

/**
 * Delete a HelpDesk Tag.
 * Note: The tag must not be in use by questions!
 *
 * Example: !tagdelete name=<tagname>
 *
 */
@Command
export class FacialRecognitionCommand extends CommandBase {

    public constructor() {

        super({

            event: Event.MESSAGE,
            name: `${ process.env.VISION_BOT_COMMAND_PREFIX }face`,
            group: 'help',
            description: 'Deletes a HelpDesk Tag.',
            requiredEnvVars: [ 'VISION_BOT_COMMAND_PREFIX', 'VISION_BOT_ADMIN_ROLE', 'GCLOUD_SERVICE_ACCOUNT' ],
            roles: [ process.env.VISION_BOT_ADMIN_ROLE ],
            params: [

                {
                    name: 'name',
                    required: true

                }

            ]

        });

    }

    public async run(command: CommandParser) {

        const client = new vision.ImageAnnotatorClient();

        const [ result ] = await client.faceDetection(command.arguments[ 0 ].name);

        if (result) {

            command.obj.reply(new RichEmbed().setTitle('Facial Recognition Results')
                                             .setDescription(`The tag "${ command.namedarguments.name }" has been deleted!`)
                                             .addField('Joy Likelihood', result.faceAnnotations.joyLikelihood)
                                             .addField('Sorrow Likelihood', result.faceAnnotations.sorrowLikelihood)
                                             .addField('Anger Likelihood', result.faceAnnotations.angerLikelihood)
                                             .addField('Surpise Likelihood', result.faceAnnotations.surpriseLikelihood)
                                             .addField('Under Exposed Likelihood', result.faceAnnotations.underExposedLikelihood)
                                             .addField('Blurred Likelihood', result.faceAnnotations.blurredLikelihood)
                                             .addField('Headwear Likelihood', result.faceAnnotations.headwearLikelihood));

        } else {

            command.obj.reply(new RichEmbed().setTitle('Facial Recognition Results').setDescription(`Results could not be processed for "${ command.arguments[ 0 ].name }"! :sob:`));

        }

    }

}